<?php
declare(strict_types=1);
/**
 * NMK Living – offerte-endpoint
 * Ontvangt JSON van het offerteformulier, valideert, beperkt misbruik,
 * slaat de aanvraag op buiten public_html en mailt NMK Living + de klant.
 */

// ---- instellingen -------------------------------------------------------
const NMK_TO        = 'info@nmkliving.com';   // ontvanger van aanvragen
const NMK_FROM      = 'noreply@nmkliving.com';        // afzender (moet op eigen domein staan)
const NMK_ORIGINS   = ['https://nmkliving.com', 'https://www.nmkliving.com'];
// opslag altijd naast (buiten) public_html, ook als de site in een submap staat
define('NMK_DATA_DIR', (($p = strpos(__DIR__, '/public_html')) !== false ? substr(__DIR__, 0, $p) : dirname(__DIR__)) . '/nmk-data');
const NMK_RATE_MAX  = 5;                              // max aanvragen per IP …
const NMK_RATE_WIN  = 3600;                           // … per uur

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

// ---- alleen POST van eigen domein --------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    out(405, ['ok' => false, 'error' => 'Alleen versturen via het formulier is toegestaan.']);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, NMK_ORIGINS, true)) {
    out(403, ['ok' => false, 'error' => 'Deze aanvraag komt niet van de website van NMK Living.']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000) ?: '';
$in  = json_decode($raw, true);
if (!is_array($in)) {
    out(400, ['ok' => false, 'error' => 'De aanvraag kon niet worden gelezen. Probeer het opnieuw.']);
}

// ---- honeypot: bots vullen dit verborgen veld in -------------------------
if (trim((string)($in['website'] ?? '')) !== '') {
    out(200, ['ok' => true]); // stil negeren
}

// ---- opslagmap ----------------------------------------------------------
if (!is_dir(NMK_DATA_DIR) && !mkdir(NMK_DATA_DIR, 0750, true) && !is_dir(NMK_DATA_DIR)) {
    out(500, ['ok' => false, 'error' => 'Er ging iets mis aan onze kant. Bel of WhatsApp ons gerust.']);
}
@file_put_contents(NMK_DATA_DIR . '/.htaccess', "Require all denied\n");

// ---- rate limiting per IP (gehasht opgeslagen) -------------------------
$ipHash   = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|nmk');
$rateFile = NMK_DATA_DIR . '/rate.json';
$fh = fopen($rateFile, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $rates = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    $now = time();
    foreach ($rates as $k => $list) {
        $rates[$k] = array_values(array_filter($list, fn($ts) => $ts > $now - NMK_RATE_WIN));
        if (!$rates[$k]) unset($rates[$k]);
    }
    if (count($rates[$ipHash] ?? []) >= NMK_RATE_MAX) {
        flock($fh, LOCK_UN); fclose($fh);
        out(429, ['ok' => false, 'error' => 'Je hebt al meerdere aanvragen verstuurd. Probeer het later opnieuw of bel ons.']);
    }
    $rates[$ipHash][] = $now;
    ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($rates));
    flock($fh, LOCK_UN); fclose($fh);
}

// ---- validatie ----------------------------------------------------------
function s(mixed $v, int $max): string {
    $v = is_scalar($v) ? (string)$v : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}
$d = [
    'naam'      => s($in['naam'] ?? '', 120),
    'email'     => s($in['email'] ?? '', 160),
    'telefoon'  => s($in['telefoon'] ?? '', 40),
    'postcode'  => strtoupper(s($in['postcode'] ?? '', 10)),
    'opmerking' => s($in['opmerking'] ?? '', 2000),
    'model'     => s($in['model'] ?? '', 60),
    'doel'      => s($in['doel'] ?? '', 60),
    'wanneer'   => s($in['wanneer'] ?? '', 60),
    'adviesgesprek' => !empty($in['adviesgesprek']),
    'reservering'   => !empty($in['reservering']),
];
$errors = [];
if (mb_strlen($d['naam']) < 2)                                   $errors[] = 'Vul je naam in.';
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL))             $errors[] = 'Vul een geldig e-mailadres in.';
if (!preg_match('/^\d{4}\s?[A-Z]{2}$/', $d['postcode']))         $errors[] = 'Vul een geldige postcode in (1234 AB).';
if ($d['telefoon'] !== '' && strlen(preg_replace('/\D/', '', $d['telefoon'])) < 10) $errors[] = 'Vul een geldig telefoonnummer in.';
if ($errors) out(422, ['ok' => false, 'error' => implode(' ', $errors)]);

$loc = null;
if (isset($in['locatie']) && is_array($in['locatie'])) {
    $l = $in['locatie'];
    $loc = ['adres' => s($l['adres'] ?? '', 160), 'lat' => round((float)($l['lat'] ?? 0), 6), 'lon' => round((float)($l['lon'] ?? 0), 6),
            'rotatie' => (int)($l['rotatie'] ?? 0) % 360, 'afmeting' => s($l['afmeting'] ?? '', 40)];
    if ($loc['adres'] === '') $loc = null;
}
$cfg = null;
if (isset($in['configuratie']) && is_array($in['configuratie'])) {
    $c = $in['configuratie'];
    $cfg = [
        'model'      => s($c['model'] ?? '', 60),
        'afmeting'   => s($c['afmeting'] ?? '', 40),
        'basisprijs' => (int)($c['basisprijs'] ?? 0),
        'meerwerk'   => (int)($c['meerwerk'] ?? 0),
        'transport'  => (int)($c['transport'] ?? 0),
        'plaatsing'  => (int)($c['plaatsing'] ?? 0),
        'totaal'     => (int)($c['totaal'] ?? 0),
        'keuzes'     => array_slice(array_map(fn($k) => s($k, 120), is_array($c['keuzes'] ?? null) ? $c['keuzes'] : []), 0, 60),
    ];
}

// ---- opslaan (één JSON-regel per aanvraag) -----------------------------
$id  = date('Ymd-His') . '-' . bin2hex(random_bytes(3));
$rec = ['id' => $id, 'ontvangen' => date('c'), 'aanvraag' => $d, 'configuratie' => $cfg, 'locatie' => $loc];
file_put_contents(NMK_DATA_DIR . '/aanvragen-' . date('Y-m') . '.jsonl', json_encode($rec, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);

// ---- e-mails ------------------------------------------------------------
$eur = fn(int $n) => '€ ' . number_format($n, 0, ',', '.');
$lines = [
    "Nieuwe offerteaanvraag via nmkliving.com ($id)", '',
    "Naam:       {$d['naam']}",
    "E-mail:     {$d['email']}",
    "Telefoon:   " . ($d['telefoon'] ?: '-'),
    "Postcode:   {$d['postcode']}",
    "Model:      " . ($d['model'] ?: '-'),
    "Doel:       " . ($d['doel'] ?: '-'),
    "Plaatsing:  " . ($d['wanneer'] ?: '-'),
    "Adviesgesprek gewenst: " . ($d['adviesgesprek'] ? 'ja' : 'nee'),
    "Reservering gewenst:   " . ($d['reservering'] ? 'ja' : 'nee'),
];
if ($d['opmerking'] !== '') { $lines[] = ''; $lines[] = "Opmerking:"; $lines[] = $d['opmerking']; }
if ($loc) {
    $lines[] = ''; $lines[] = "Gewenste locatie: {$loc['adres']}";
    $lines[] = "  Woning ({$loc['afmeting']}) geplaatst op {$loc['lat']}, {$loc['lon']}, {$loc['rotatie']}° gedraaid";
    $lines[] = "  Kaart: https://www.google.com/maps?q={$loc['lat']},{$loc['lon']}";
}
if ($cfg) {
    $lines[] = ''; $lines[] = "Configuratie: {$cfg['model']} ({$cfg['afmeting']})";
    foreach ($cfg['keuzes'] as $k) $lines[] = "  - $k";
    $lines[] = "Basisprijs {$eur($cfg['basisprijs'])} + meerwerk {$eur($cfg['meerwerk'])} + transport {$eur($cfg['transport'])} + plaatsing {$eur($cfg['plaatsing'])}";
    $lines[] = "Totaal (indicatief, excl. btw): {$eur($cfg['totaal'])}";
}
$headers = function (string $replyTo): string {
    return implode("\r\n", [
        'From: NMK Living <' . NMK_FROM . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);
};
$subj = fn(string $t) => '=?UTF-8?B?' . base64_encode($t) . '?=';
$safeReply = preg_replace('/[\r\n]/', '', $d['email']) ?? '';

$sentTeam = @mail(NMK_TO, $subj('Offerteaanvraag: ' . ($d['model'] ?: 'model onbekend') . ' – ' . $d['naam']), implode("\n", $lines), $headers($safeReply), '-f' . NMK_FROM);

$first = explode(' ', $d['naam'])[0];
$conf = "Beste $first,\n\nBedankt voor je aanvraag bij NMK Living. We hebben hem goed ontvangen (referentie $id).\n\n"
      . "Binnen 2 werkdagen ontvang je je complete PDF-offerte met specificaties, prijzen en planning."
      . ($d['adviesgesprek'] ? "\nWe bellen je ook voor een gratis adviesgesprek." : '')
      . "\n\nHeb je in de tussentijd een vraag? Beantwoord dan gewoon deze e-mail.\n\nMet vriendelijke groet,\nNMK Living\nModular homes for a better tomorrow\n";
@mail($d['email'], $subj('Je offerteaanvraag bij NMK Living'), $conf, $headers(NMK_TO), '-f' . NMK_FROM);

if (!$sentTeam) {
    // aanvraag staat wel veilig opgeslagen; meld eerlijk dat bevestiging kan uitblijven
    out(200, ['ok' => true, 'id' => $id, 'mail' => false]);
}
out(200, ['ok' => true, 'id' => $id]);
