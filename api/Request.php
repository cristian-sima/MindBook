<?php 

Class Request {
    public static function extract($id) {
        if(isset($_POST[$id])){
            return $_POST[$id];
        }
        return null;
    }
}