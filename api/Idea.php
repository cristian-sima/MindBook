<?php

class Idea {

    private $id;
    private $parent;
    private $content;
    private $children = array();
    private $path;

    public function Idea($id) {
        $this->id = $id;
        $this->loadContent();
    }

    private function loadContent() {
        $sth = Database::$db->prepare('SELECT path, content, parent
            FROM idea
            WHERE id = ?');

        $sth->execute(array($this->id));

        foreach ($sth->fetchAll() as $row) {
            $this->content = $row["content"];
            $this->parent = $row["parent"];
            $this->path = $row["path"];
        }
    }

    public function getChildrenAtLevel($level) {

        function getRegex($level, $path, $id) {

            function getPrefix($p, $id) {
                return $p . "@" . $id;
                //return str_replace("@", "@", $path);
            }

            function getQuantifier($level) {
                // extract all
                if ($level === "ALL") {
                    return "0,";
                }
                return $level;
            }

            function insertValues($quantifier, $prefix, $digit) {
                return "^(" . $prefix . ")(@(" . $digit . "+)){" . $quantifier . "}$";
            }

            $quantifier = getQuantifier($level);
            $prefix = getPrefix($path, $id);
            $digit = "[[:digit:]]";


            $toReturn = insertValues($quantifier, $prefix, $digit);

            return $toReturn;
        }
        
        function getSQL($regex) {
            return "SELECT id, path, content, parent
            FROM idea
            WHERE path REGEXP '". $regex . "'
            ORDER BY parent ASC ";
        }

        $regex = getRegex($level, $this->path, $this->id);
        $sql = getSQL($regex);
        
        
        
        // echo "Regex: <b>/" . $regex . "/gm</b><br />";
        // echo "SQL:<pre> " . $sql . "</pre><br />";

        $sth = Database::$db->prepare($sql);

        $sth->execute();

        
        foreach ($sth->fetchAll() as $row) {
            $id = $row["id"];
            $parent = $row["parent"];
            $content = $row["content"];
            
            $child = array("id" => $id,
                            "parent" => $parent,
                            "content" => $content);
            
            array_push($this->children, $child);
        }
    }

    public function getAllChildren() {
        $this->getChildrenAtLevel("ALL");
    }

    public function getChildren() {
        $this->getChildrenAtLevel(0);
    }
    
    public function getParent() {
        return $this->parent;
    }

    public function getId() {
        return $this->id;
    }

    public function getContent() {
        return $this->content;
    }

    public function getPath() {
        return $this->path;
    }
    
    public function __toString() {

        $array = array("id" => $this->id,
            "parent" => $this->parent,
            "content" => $this->content,
            "children" => $this->children);

        return json_encode($array, JSON_PRETTY_PRINT);
    }

}
