<?php

require_once "Security.php";

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
                $p = str_replace("[", "\\\\[", $p);
                $p = str_replace("]", "\\\\]", $p);
                return $p . "\\\\[" . $id . "\\\\]";
            }

            function getQuantifier($level) {
                // extract all
                if ($level === "ALL") {
                    return "0,";
                }
                return "0," . $level;
            }

            function insertValues($quantifier, $prefix, $digit) {
                return "^(" . $prefix . ")(\\\\[(" . $digit . "+)\\\\]){" . $quantifier . "}$";
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
            WHERE path REGEXP '" . $regex . "'
            ORDER BY path ASC ";
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


            $safeContent = Security::XSS($content);


            $child = array("id" => $id,
                "parent" => $parent,
                "content" => $safeContent);

            array_push($this->children, $child);
        }
    }

    public function getChildren($level) {
        $this->getChildrenAtLevel($level);
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

    public function setContent($newContent) {
        $stmt = Database::$db->prepare('UPDATE idea
        SET content = :content       
        WHERE id = :id ');
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':content', $newContent);
        $stmt->execute();

        $this->content = $newContent;
        return "true";
    }

    public function setParent($newParentId) {

        $oldPath = $this->getPath() . "[" . $this->getId() . "]";

        $parent = new ChildIdea($newParentId);
        $path = $parent->getPath() . "[" . $parent->getId() . ']';

        $stmt = Database::$db->prepare('UPDATE idea
        SET parent = :parent, path = :path       
        WHERE id = :id ');
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':parent', $newParentId);
        $stmt->bindParam(':path', $path);
        $stmt->execute();

        $this->content = $newParentId;


        $newPath = $path . "[" . $this->getId() . ']';

        // change the path of the subchildren

        $stmt2 = Database::$db->prepare('UPDATE idea
        SET path = replace(path, :oldPath, :newPath)');
        $stmt2->bindParam(':oldPath', $oldPath);
        $stmt2->bindParam(':newPath', $newPath);
        $stmt2->execute();


        return "true";
    }

    public function remove() {
        // move the children to the grandparent

        $this->changeParentOfChildren($this->getParent(), $this->getPath());

        // delete idea
        $stmt2 = Database::$db->prepare('DELETE from idea
        WHERE id = :id ');
        $stmt2->bindParam(':id', $this->id);
        $stmt2->execute();

        return "true";
    }

    public function removeItAndChildren() {
        // delete idea
        $stmt1 = Database::$db->prepare('DELETE from idea
        WHERE id = :id ');
        $stmt1->bindParam(':id', $this->id);
        
        
        // delete all children        
        $prefix = $this->getPath(). "[" . $this->getId(). "]";

        $leftChange = str_replace("[", "\\\\[", $prefix);
        $prefix = str_replace("]", "\\\\]", $leftChange);

        $regex = "^(" . $prefix . ")(\\\\[([[:digit:]]+)\\\\]){0,}$";

        $stmt2 = Database::$db->prepare("DELETE from idea
        WHERE path REGEXP '" . $regex . "'");
        $stmt2->bindParam(':id', $this->id);

        $stmt2->execute();
    }

    public function changeParentOfChildren($newParentId, $path) {

        $stmt = Database::$db->prepare('UPDATE idea
        SET parent = :parent, path = :path       
        WHERE parent = :id ');
        $stmt->bindParam(':parent', $newParentId);
        $stmt->bindParam(':path', $path);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
    }

    public function __toString() {

        $safeContent = Security::XSS($this->getContent());

        $array = array("id" => $this->id,
            "parent" => $this->parent,
            "content" => $safeContent,
            "children" => $this->children);

        return json_encode($array, JSON_PRETTY_PRINT);
    }

}
