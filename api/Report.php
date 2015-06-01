<?php
require_once("MindBook.php");

Class Report {

    private $book = null;

    public function Report($book) {
        $this->book = $book;
        $this->report = Array();
    }

    public function processIdea(&$clientIdea) {

        $book = $this->book;

        $correlationExists = $book->checkIdeaExists($clientIdea["parent"], $clientIdea["content"]);

        if ($correlationExists === "true") {
            $this->processCorrelation($clientIdea);
        } else {
            $this->processNonCorrelation($clientIdea);
        }
    }

    private function processCorrelation($clientIdea) {

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

                $this->addIdeatoReport($clientIdea["id"], array("status" => "modification",
                    "id" => $clientIdea["id"]));
            } else {

                $this->addIdeatoReport($clientIdea["id"], array("status" => "nothing_done"));
            }
        } else {
            // id-ul local este diferit de cel de pe server

            if ($clientIdExists === "true") {
                // idea locala exista deja in sistem

                $oldIdea = new ChildIdea($clientIdea["id"]);

                $newPath = $correlatedIdea->getPath() . "[" . $correlatedIdea->getId() . "]";
                $oldIdea->changeParentOfChildren($correlatedIdea->getId(), $newPath);

                $oldIdea->remove();

                $this->processChildren($clientIdea, $correlatedIdea->getId());
            }

            $this->addIdeatoReport($clientIdea["id"], array("status" => "correlation",
                "correlatedId" => $correlatedIdea->getId()));


            // var_dump($clientIdea["children"][0]);
        }

    }

    private function processNonCorrelation($clientIdea) {
        // the id is not

        $book = $this->book;

        $clientIdExists = $book->checkIdeaExistsById($clientIdea["id"]);

        // the idea is not in the database
        if ($clientIdExists === "false") {
            $book->createIdea($clientIdea["parent"], $clientIdea["content"], $clientIdea["id"]);
            $idea = new ChildIdea($clientIdea["id"]);

            $parent = $idea->getId();
            $path = $idea->getPath() . "[" . $parent . ']';


            $this->addIdeatoReport($clientIdea["id"], array("status" => "creation",
                "id" => $clientIdea["id"]));


            if (isset($clientIdea["children"])) {
                // take back its children
                $childrenArray = $clientIdea["children"];

                // in case it was correlated 
                foreach ($childrenArray as $child) { //forea
                    $id = $child["id"];
                    $stmt = Database::$db->prepare('UPDATE idea
              SET parent = :parent, path = :path
              WHERE id = :id ');
                    $stmt->bindParam(':parent', $parent);
                    $stmt->bindParam(':path', $path);
                    $stmt->bindParam(':id', $id);
                    $stmt->execute();
                    ///$ideasReport["children_change"] = "true";
                }

                $this->processChildren($clientIdea, $clientIdea["id"]);
            }
        } else {

            $this->addIdeatoReport($clientIdea["id"], array("status" => "modification",
                "id" => $clientIdea["id"]));

            $oldIdea = new ChildIdea($clientIdea["id"]);

            // UPDATE IT
            $oldIdea->setContent($clientIdea["content"]);
            $oldIdea->setParent($clientIdea["parent"]);
        }
    }

    private function processChildren(&$clientIdea, $newParent) {

        $childrenReport = array();
        if (isset($clientIdea["children"])) {
            $childrenArray = $clientIdea["children"];

            foreach ($childrenArray as $child) {
                $child["parent"] = $newParent;
                $this->processIdea($child);
            }
        }
        return $childrenReport;
    }

    private function addIdeatoReport($id, $info) {
        $info["clientIdeaId"] = $id;
        $this->report[$id] = $info;
    }

    public function debug($arr) {
        echo "<pre>". print_r($arr)."</pre>";
    }
    
    public function getReport() {
        return $this->report;
    }
}
    