<?php
/**
 * This file will return JSON response
 */
require_once('../helpers/form_helpers.php');
require_once('class/MicrosoftTranslator.class.php');

$from = filter_text($_REQUEST['from']);
$to   = filter_text($_REQUEST['to']);
$text = filter_text($_REQUEST['text']);

$translator = new MicrosoftTranslator(getenv("AZURE_KEY"));
$translator->translate($from, $to, $text);

$response = json_decode($translator->response->jsonResponse);
$response->from = $from;
$response->to   = $to;
$response->text = $text;
$response->result = $response->translation;

header('Content-Type: application/json');
echo json_encode($response);
?>