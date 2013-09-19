<?php
/**
 * This file will return JSON response
 */
require_once('../helpers/form_helpers.php');
require_once('../google/GoogleTranslate.php');

$from = filter_text($_REQUEST['from']);
$to   = filter_text($_REQUEST['to']);
$text = filter_text($_REQUEST['text']);

$translator = new GoogleTranslate();

$result = new stdClass();
$result->from = $from;
$result->to = $to;
$result->text = $text;
$result->result = $translator->setLangFrom($from)->setLangTo($to)->translate($text);

header('Content-Type: application/json');
echo json_encode($result);
?>