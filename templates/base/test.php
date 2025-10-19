<?php
echo "ok\n";
$key = random_bytes(32);
$iv  = random_bytes(16);
$pt  = "hello malware lab";
$ct  = openssl_encrypt($pt, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);
$pt2 = openssl_decrypt($ct, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);
echo $pt2, "\n";