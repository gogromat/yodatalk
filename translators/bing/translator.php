<?php
/**
 * This file will return JSON response
 */
require_once('../helpers/form_helpers.php');
var_dump($_REQUEST);
require_once('config.inc.php');
require_once('class/MicrosoftTranslator.class.php');

$from = filter_text($_REQUEST['from']);
$to   = filter_text($_REQUEST['to']);
$text = filter_text($_REQUEST['text']);


$translator = new MicrosoftTranslator(ACCOUNT_KEY);
$translator->translate($from, $to, $text);
echo $translator->response->jsonResponse;
?>