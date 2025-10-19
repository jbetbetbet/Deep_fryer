<?php
// Mimic an HTTPS POST to the target path
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTPS'] = 'on';
$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';

$path = '/panel/weyd/weyd_services.php';  // << set your target path here

// Fill typical fields routers check
$_SERVER['REQUEST_URI']  = $path;
$_SERVER['SCRIPT_NAME']  = '/index.php';
$_SERVER['PHP_SELF']     = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/index.php';
$_SERVER['DOCUMENT_ROOT']   = __DIR__;
$_SERVER['SERVER_NAME']  = 'localhost';
$_SERVER['HTTP_HOST']    = 'localhost';
$_SERVER['SERVER_PORT']  = '443';
$_SERVER['REMOTE_ADDR']  = '127.0.0.1';
$_SERVER['QUERY_STRING'] = '';

// If code reads POST/Body, set what it expects
$_POST['licensekey'] = 'DEV-TEST-001';
$_POST['secret']     = 'cp2-module-by-ian-implayer';

// Boot the app (adjust if the panel’s entrypoint differs)
require __DIR__ . '/index.php';