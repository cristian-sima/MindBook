<?php


require_once "/Idea.php";

class ChildIdea extends Idea {

    

    public function ChildIdea($id) {
        if($id == 1) {
        //    throw new Exception ("Id-ul unui copil nu poate sa fie 1");
        }
    
        parent::__construct($id);
    }

}
