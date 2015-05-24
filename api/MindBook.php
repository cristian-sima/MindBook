<?php

require "Database.php";

Class MindBook {

    private $connection;
    private $homeIdeaID = 1;

    public function MindBook() {
        
    }

    public function getHome() {
        return $this->getIdea($this->homeIdeaID);
    }

    public function getHomeIdeaID() {
        return $this->homeIdeaID;
    }

    public function getIdea($targetID) {
        $idea = new Idea($targetID);
        return $idea->__toString();
    }

    public function getAllChildrenOfIdea($targetID) {
        $idea = new Idea($targetID);
        $idea->loadAllChildren();
        return $idea;
    }

    public function getCounterIndex() {
        $id = -1;
        $sth = Database::$db->prepare('SELECT id
            FROM idea
            ORDER BY id DESC LIMIT 0,1');

        $sth->execute();

        foreach ($sth->fetchAll() as $row) {
            $id = $row["id"];
        }

        return $id;
    }

    public function getInitData() {
        $array = array();
        $array["counter"] = $this->getCounterIndex();
        $array["home"] = $this->getHomeIdeaID();
        return json_encode($array);
    }
    
    public function createIdea($content, $parent) {
        $array = array("status" => true);
        $stmt = Database::$db->prepare("INSERT INTO idea (content, parent) VALUES (:content, :parent)");
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':parent', $parent);
        $stmt->execute();
        return json_encode($array);
    }
    
    public function findIdeas ($termenCautat) {
        
        $toReturn = array();
        
        $sth = Database::$db->prepare('SELECT id, content, parent
            FROM idea
            WHERE content LIKE ?');

        $sth->execute(array("%".$termenCautat."%"));

        foreach ($sth->fetchAll() as $row) {
            $content = $row["content"];
            $id = $row["id"];
            $parent_id = $row["parent"];
            
            if($parent_id !== null) {
                $idea = new ChildIdea($parent_id);
                $parent = array("id" => $idea->getParent(),
                                "content" => $idea->getContent());
            } else {
                $parent = null;
            }
            
            
            array_push($toReturn, array("id" => $id, "content" => $content, 'parent' => $parent));
        }               
        return json_encode($toReturn);
    }
}
