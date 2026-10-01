<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'Lead delivery is not configured on the server.']);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configPath;

$allowedOrigins = $config['allowed_origins'] ?? ['https://riverbird.in'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request body']);
    exit;
}

$honeypot = trim((string) ($data['company_website'] ?? ''));
if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid submission']);
    exit;
}

$name = trim((string) ($data['name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
$service = trim((string) ($data['service'] ?? ''));
$intent = trim((string) ($data['intent'] ?? ''));
$openedAt = (int) ($data['opened_at'] ?? 0);

$minElapsed = (int) ($config['min_elapsed_ms'] ?? 4000);
if ($openedAt > 0 && (int) (microtime(true) * 1000) - $openedAt < $minElapsed) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Please wait a moment before submitting.']);
    exit;
}

if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 80) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid name.']);
    exit;
}

if (!preg_match('/^[\p{L}\p{M}\s.\'-]+$/u', $name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid name.']);
    exit;
}

$phoneDigits = preg_replace('/\D+/', '', $phone);
if (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid phone number.']);
    exit;
}

$allowedServices = [
    'Web Engineering',
    'SEO & Ranking',
    'Digital Marketing',
    'Staffing Solutions',
    'Careers',
    'General Inquiry',
];

if (!in_array($service, $allowedServices, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please choose a service option.']);
    exit;
}

$spamPatterns = '/(https?:\/\/|www\.|bitcoin|casino|viagra|seo backlinks|click here)/i';
$blob = strtolower($name . ' ' . $phone . ' ' . $intent);
if (preg_match($spamPatterns, $blob)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Message could not be sent.']);
    exit;
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateDir = __DIR__ . '/storage/rate';
if (!is_dir($rateDir)) {
    @mkdir($rateDir, 0755, true);
}

$rateFile = $rateDir . '/' . hash('sha256', $clientIp) . '.json';
$limit = (int) ($config['rate_limit_per_hour'] ?? 8);
$now = time();
$window = [];

if (is_file($rateFile)) {
    $decoded = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $window = array_values(array_filter($decoded, static fn ($ts) => is_int($ts) && $ts > $now - 3600));
    }
}

if (count($window) >= $limit) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later or call us directly.']);
    exit;
}

$window[] = $now;
file_put_contents($rateFile, json_encode($window), LOCK_EX);

$to = (string) ($config['lead_email'] ?? 'info@riverbird.in');
$fromEmail = (string) ($config['from_email'] ?? 'noreply@riverbird.in');
$fromName = (string) ($config['from_name'] ?? 'Riverbird Website Chat');

$subject = 'New chat lead: ' . $service;
$body = "New lead from Riverbird website chat\n\n";
$body .= "Name: {$name}\n";
$body .= "Phone: {$phone}\n";
$body .= "Service: {$service}\n";
if ($intent !== '') {
    $body .= "Topic: {$intent}\n";
}
$body .= "Submitted: " . gmdate('c') . " UTC\n";
$body .= "IP hash: " . hash('sha256', $clientIp) . "\n";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . mb_encode_mimeheader($fromName) . " <{$fromEmail}>",
    'Reply-To: ' . $fromEmail,
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not send email. Please use our contact page or call +91 99949 67655.']);
    exit;
}

echo json_encode(['success' => true]);
