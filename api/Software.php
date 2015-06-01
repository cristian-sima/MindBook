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

        if ($correlatedIdea->getId() == $clientIdea["id"]) {
            // id-ul local la fel cu cel de pe server

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
            // id-ul local este diferit de cel de pe server

            if ($clientIdExists === "true") {
                // idea locala exista deja in sistem

                $oldIdea = new ChildIdea($clientIdea["id"]);

                $oldIdea->changeParentOfChildren($correlatedIdea->getId(), $correlatedIdea->getPath());
               
                $oldIdea->remove();
                
                $childrenArray = $clientIdea['children'];
                
                foreach ($childrenArray as $child) {
                    $child["parent"] = $correlatedIdea->getId();
                    $childReport = $this->getIdeaReport($child);
                    array_push($ideasReport, $childReport);
                }
            }


            $ideasReport["status"] = "correlation";
            $ideasReport["correlatedId"] = $correlatedIdea->getId();

            // var_dump($clientIdea["children"][0]);
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
            $childrenArray = $clientIdea["children"];

            // in case it was correlated 
            /*foreach ($childrenArray as $id) { //forea
                
                $stmt = Database::$db->prepare('UPDATE idea
                        SET parent = :parent, path = :path       
                        WHERE id = :id ');
                $stmt->bindParam(':parent', $parent);
                $stmt->bindParam(':path', $path);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                $ideasReport["children_change"] = "true";
            }*/

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
}
