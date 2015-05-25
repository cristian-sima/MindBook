<?php


class Security {

    public static function XSS ($string) {
        return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
    }
}
