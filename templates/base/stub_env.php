<?php
// 1) Pretend we’re a legit HTTPS POST hitting the encoded endpoint
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTPS'] = 'on';
$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['HTTP_HOST']   = 'localhost';
$_SERVER['SERVER_PORT'] = '443';
$_SERVER['DOCUMENT_ROOT']   = __DIR__;
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/index.php';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF']    = '/index.php';

// If the target is /api/weyd/api/weyd/check.php:
$_SERVER['REQUEST_URI'] = '/api/weyd/api/weyd/check.php';
$_SERVER['QUERY_STRING'] = '';

// 2) Seed inputs the module expects
$_POST['licensekey'] = 'DEV-TEST-001';
$_POST['secret']     = 'cp2-module-by-ian-implayer';

// 3) Satisfy app helpers the module calls (minimal versions)
if (!function_exists('get_module_db_path')) {
    function get_module_db_path($dir, $name) {
        // point into the unpacked Main tree as needed
        return __DIR__ . "/includes/db/$name.sqlite";
    }
}

// If the module references other lightweight helpers/constants, define them here:
if (!defined('IN_PANEL')) define('IN_PANEL', true);
if (!defined('PANEL_VERSION')) define('PANEL_VERSION', 'dev');

// 4) (Optional) Soft-instrument dangerous I/O without breaking runtime.
// You can log parameters or short-circuit as needed.
// NOTE: You can’t redeclare internal functions like curl_exec/mail without runkit.
// Prefer MITM for network, or wrap app’s own helper functions if they exist.

// 5) Now actually run the encoded file (or the front controller if it’s required)
require __DIR__ . '/api/weyd/api/weyd/check.php';
// or: require __DIR__ . '/index.php';  // if module must be booted via index
