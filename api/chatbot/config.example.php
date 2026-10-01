<?php
/**
 * Copy to config.php on Hostinger (not committed to git).
 * Uses PHP mail() by default; set smtp_* if you use Hostinger SMTP in hPanel.
 */
return [
    'lead_email' => 'info@riverbird.in',
    'from_email' => 'noreply@riverbird.in',
    'from_name' => 'Riverbird Website Chat',
    'allowed_origins' => [
        'https://riverbird.in',
        'https://www.riverbird.in',
        'http://localhost',
        'http://127.0.0.1',
    ],
    'min_elapsed_ms' => 4000,
    'rate_limit_per_hour' => 8,
];
