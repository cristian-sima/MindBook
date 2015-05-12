<?php 

Class Request {
    public static function extract($id) {
        if(isset($_GET[$id])){
            return $_GET[$id];
        }
        return null;
    }
}