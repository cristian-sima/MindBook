<?php

class Idea {

    private $id;
    private $parent;
    private $content;
    private $children = array();

    public function Idea($id) {
        $this->id = $id;

        $this->loadContent();
        $this->loadChildren();
    }

    private function loadContent() {
        $sth = Database::$db->prepare('SELECT id, content, parent
            FROM idea
            WHERE id = ?');

        $sth->execute(array($this->id));

        foreach ($sth->fetchAll() as $row) {
            $this->id = $row["id"];
            $this->parent = $row["parent"];
            $this->content = $row["content"];
        }
    }

    private function loadChildren() {
        $sth = Database::$db->prepare('SELECT id, content
            FROM idea
            WHERE parent = ?');

        $sth->execute(array($this->id));

        foreach ($sth->fetchAll() as $row) {
            $id = $row['id'];
            $content = $row["content"];
            $this->children[$id] = array("id" => $id, "content" => $content);
        }
    }

    public function getParent() {
        return $this->parent;
    }

    public function getId() {
        return $this->id;
    }
    
    public function getContent () {
        return $this->content;
    }

    public function __toString() {
        $array = array("id" => $this->id,
            "parent" => $this->parent,
            "content" => $this->content,
            "children" => $this->children);

        return json_encode($array, JSON_PRETTY_PRINT);
    }
    
    public function loadAllChildren() {
        foreach($this->children as &$child) {
            $child = new Idea($child["id"]);
            $child = $child->__toString();
          //  $this->children[$child["id"]]->loadAllChildren();
        }
    }
}
