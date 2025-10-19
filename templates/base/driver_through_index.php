<?php
// Fakes an HTTP request reaching the router at the target path
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTPS'] = 'on';
$_SERVER['HTTP_X_FORWARDED_PROTO'] = 'https';

$path = '/api/weyd/api/weyd/check.php'; // <--- adjust target here
$_SERVER['REQUEST_URI']  = $path;
$_SERVER['SCRIPT_NAME']  = '/index.php';
$_SERVER['PHP_SELF']     = '/index.php';
$_SERVER['QUERY_STRING'] = ''; // add if you need ?a=b

// If the script reads php://input instead of $_POST, this still works;
// otherwise set keys here:
$_POST['licensekey'] = 'DEV-TEST-001';
$_POST['secret']     = 'cp2-module-by-ian-implayer';

// Include the app’s entrypoint (adjust to your panel’s public index file)
require __DIR__ . '/index.php';