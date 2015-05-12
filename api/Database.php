<?php



class Database {

    public static $servername = "localhost";
    public static $username = "root";
    public static $password = "";
    public static $name = "mind_book";
    public static $db;
    
    public static function connect () {
        try {
            self::$db = new PDO("mysql:host=".self::$servername.";dbname=" . self::$name, self::$username, self::$password);
            // set the PDO error mode to exception
            self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            die();
        }
    }
}
