<?php
function filter_text($text) {
    return strip_tags(htmlspecialchars(trim($text)));
}
?>