<?php

header('Content-Type: application/json');

// Carica le variabili d'ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Legge i dati della richiesta
$request = json_decode(file_get_contents('php://input'), true);

// Log dei dati ricevuti per debug
file_put_contents('php://stderr', print_r($request, true));

$endpoint = $request['endpoint'];
$data = $request['data'];

$url = 'https://roydermal.it/wp-json/wc/v3' . $endpoint;

// Le chiavi di WooCommerce
$consumer_key = getenv('WC_CONSUMER_KEY');
$consumer_secret = getenv('WC_CONSUMER_SECRET');

// Verifica se le chiavi sono state caricate correttamente
if (!$consumer_key || !$consumer_secret) {
    echo json_encode(array('error' => 'Chiavi API non trovate'));
    exit;
}

// Configura la richiesta cURL
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, $consumer_key . ":" . $consumer_secret);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(array('error' => curl_error($ch)));
    curl_close($ch);
    exit;
}

curl_close($ch);

echo $response;
