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
       return $idea;
    }
    
    public function getAllChildrenOfIdea($targetID) {
        $idea = new Idea($targetID);
        $idea->loadAllChildren();
        return $idea;
    }
}
