<?php

require_once("MindBook.php");

Class Software {

    private $book = null;

    public function Software($book) {
        $this->book = $book;
    }

    public function getIdeaReport($clientIdea) {

        $book = $this->book;

        $ideasReport = array();

        $correlationExists = $book->checkIdeaExists($clientIdea["parent"], $clientIdea["content"]);

        if ($correlationExists === "true") {
            $ideasReport = $this->getCorrelationReport($clientIdea);
        } else {
            $ideasReport = $this->getNonCorrelationReport($clientIdea);
        }
       
        
        $ideasReport["clientIdeaId"] = $clientIdea["id"];
        
        return $ideasReport;
    }

    private function getCorrelationReport($clientIdea) {

        $ideasReport = array();
        $book = $this->book;

        $correlationIdeaId = $book->findIdeaIdByContentAndParent($clientIdea["parent"], $clientIdea["content"]);
        $clientIdExists = $book->checkIdeaExistsById($clientIdea["id"]);

        $correlatedIdea = new ChildIdea($correlationIdeaId);

        // corresponding idea id is the same as the client one
        if ($correlatedIdea->getId() == $clientIdea["id"]) {
            // check it has the same parent
            if ($correlatedIdea->getParent() != $clientIdea["parent"]) {
                // UPDATE IT
                $correlatedIdea->setContent($clientIdea["content"]);
                $correlatedIdea->setParent($clientIdea["parent"]);
                $ideasReport["status"] = "modification";
                $ideasReport["id"] = $clientIdea["id"];
            } else {
                $ideasReport["status"] = "nothing_done";
            }
        } else {
            if ($clientIdExists === "true") {
                // change the children to the new one
                // delete it
                // mark it as the corresponding
                $oldIdea = new ChildIdea($clientIdea["id"]);

                $oldIdea->changeParentOfChildren($correlatedIdea->getId(), $correlatedIdea->getPath());

                // do it for its children 
                $childrenArray = $this->extractChildren($clientIdea);                
                               
                $oldIdea->remove();
                
                foreach ($childrenArray as $child) {
                    var_dump($child);
                    die();
                    $childReport = $this->getIdeaReport($child);
                    array_push($ideasReport, $childReport);
                }                
            }

            $ideasReport["status"] = "correlated";
            $ideasReport["correlatedId"] = $correlatedIdea->getId();
        }
        
        return $ideasReport;
    }

    private function getNonCorrelationReport($clientIdea) {
        // the id is not

        $book = $this->book;
        $ideasReport = array();

        $clientIdExists = $book->checkIdeaExistsById($clientIdea["id"]);

        // the idea is not in the database
        if ($clientIdExists === "false") {
            $book->createIdea($clientIdea["parent"], $clientIdea["content"], $clientIdea["id"]);
            $idea = new ChildIdea($clientIdea["id"]);

            $parent = $idea->getId();
            $path = $idea->getPath() . "[" . $parent . ']';

            // take back its children
            $childrenArray = $this->extractChildren($clientIdea);

            // in case it was correlated 
            foreach ($childrenArray as $id) { //forea
                $stmt = Database::$db->prepare('UPDATE idea
                        SET parent = :parent, path = :path       
                        WHERE id = :id ');
                $stmt->bindParam(':parent', $parent);
                $stmt->bindParam(':path', $path);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $ideasReport["children_change"] = "true";
            }

            $ideasReport["status"] = "creation";
        } else {
            $ideasReport["status"] = "modification";
            $oldIdea = new ChildIdea($clientIdea["id"]);

            // UPDATE IT
            $oldIdea->setContent($clientIdea["content"]);
            $oldIdea->setParent($clientIdea["parent"]);
        }
        $ideasReport["id"] = $clientIdea["id"];
    return $ideasReport;
    }
    
    private function extractChildren (&$clientIdea) {
        return explode(',', $clientIdea["children"]);
    }    
}
