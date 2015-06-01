<?php

require_once("MindBook.php");

Class Report {

    private $book = null;

    public function Report($book) {
        $this->book = $book;
        $this->report = Array();
    }

    public function processIdea(&$clientIdea) {

     
        
        $isCorrelation = $this->book->isCorrelation($clientIdea);

        if ($isCorrelation) {
            $this->processCorrelation($clientIdea);
        } else {
            $this->processNonCorrelation($clientIdea);
        }
    }

    private function processCorrelation(&$clientIdea) {

        $correlationId = $this->book->getIdeaIdByContentAndParent($clientIdea);

        $correlationIdea = new ChildIdea($correlationId);
     
        if (intval($correlationId) === intval($clientIdea["id"])) {
            $this->cor_sameLocalIdAsCorrId($clientIdea, $correlationIdea);
        } else {
            $this->cor_localIdDifferFromCorrId($clientIdea, $correlationIdea);
        }
    }

    private function cor_sameLocalIdAsCorrId(&$clientIdea, $correlationIdea) {

        if ($correlationIdea->getParent() != $clientIdea["parent"]) {
            // UPDATE IT
            $correlationIdea->setContent($clientIdea["content"]);
            $correlationIdea->setParent($clientIdea["parent"]);

            $this->reportIdea($clientIdea["id"], array("status" => "modification",
                "id" => $clientIdea["id"]));
        } else {
            $this->reportIdea($clientIdea["id"], array("status" => "nothing_done"));
        }
    }

    private function cor_localIdDifferFromCorrId(&$clientIdea, $correlationIdea) {

        $ideaExists = $this->book->checkIdeaExists($clientIdea["id"]);

        if ($ideaExists) {
            $oldIdea = new ChildIdea($clientIdea["id"]);
            $oldIdea->remove();
        }

        $this->processChildren($correlationIdea, $clientIdea);

        $report = array("status" => "correlation",
            "correlatedId" => $correlationIdea->getId());
        $this->reportIdea($clientIdea["id"], $report);
    }

    private function processNonCorrelation($clientIdea) {
        // the id is not

        $ideaExists = $this->book->checkIdeaExists($clientIdea["id"]);

        // the idea is not in the database
        if ($ideaExists) {
            $this->non_IdeaExists($clientIdea);
        } else {
            $this->non_noLocalIdea($clientIdea);
        }
    }

    private function non_noLocalIdea(&$clientIdea) {

        $report = array("status" => "creation",
            "id" => $clientIdea["id"]);
        
        $idea = $this->book->createIdeaByArray($clientIdea);        

        
        $this->reportIdea($clientIdea["id"], $report);

        $this->processChildren($idea, $clientIdea);
    }

    private function non_IdeaExists(&$clientIdea) {

        $id = $clientIdea["id"];
        $report = array("status" => "modification", "id" => $id);

        $oldIdea = new ChildIdea($id);
        
        // UPDATE IT
        $oldIdea->setContent($clientIdea["content"]);
        $oldIdea->setParent($clientIdea["parent"]);        
        
        $this->reportIdea($id, $report);
    }

    public function processChildren($idea, &$clientIdea) {

        if (is_array($idea)) {
            $newParent = $idea['id'];
        } else {
            $newParent = $idea->getId();
        }

        if (isset($clientIdea["children"])) {

            $childrenArray = $clientIdea["children"];

            // remove existing ones
            foreach ($childrenArray as &$child) {
                $this->removeEntireIdeaById($child["id"]);
                $child["parent"] = $newParent;
                $this->processIdea($child);
            }
        }
    }

    private function removeEntireIdeaById($id) {
        $ideaExists = $this->book->checkIdeaExists($id);

        if ($ideaExists) {
            $childIdea = new Idea($id);
            $childIdea->removeItAndChildren();
        }
    }

    private function reportIdea($id, $info) {
        $info["clientIdeaId"] = $id;
        $this->report[$id] = $info;
    }

    public function debug(&$arr) {
        echo "<pre>" . print_r($arr) . "</pre>";
    }

    public function getReport() {
        return $this->report;
    }

}
