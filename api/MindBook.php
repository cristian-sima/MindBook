<?php

require_once "Database.php";

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

    public function findIdeas($termenCautat) {

        $toReturn = array();

        $sth = Database::$db->prepare('SELECT id, content, parent
            FROM idea
            WHERE content LIKE ?
            LIMIT 0,10');

        $sth->execute(array("%" . $termenCautat . "%"));

        foreach ($sth->fetchAll() as $row) {
            $content = $row["content"];
            $id = $row["id"];
            $parent_id = $row["parent"];
            
            $safeContent = Security::XSS($content);

            if ($parent_id !== null) {
                $idea = new ChildIdea($parent_id);
                $parent = array("id" => $idea->getParent(),
                    "content" => Security::XSS($idea->getContent()));
            } else {
                $parent = null;
            }


            array_push($toReturn, array("id" => $id, "content" => $safeContent, 'parent' => $parent));
        }
        return json_encode($toReturn);
    }

    function createIdea($parent_id, $content, $id) {

        $parent = new ChildIdea($parent_id);

        $path = $parent->getPath() . "@" . $parent->getId();

        $stmt = Database::$db->prepare("INSERT INTO idea (id, path, content, parent) VALUES (:id, :path, :content, :parent)");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':path', $path);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':parent', $parent_id);
        $stmt->execute();
        return "true";
    }

    public function checkIdeaExistsById($id) {
        $sth = Database::$db->prepare('SELECT id, content
            FROM idea
            WHERE id = :id
            LIMIT 0,1');

        $sth->bindParam(':id', $id);

        $sth->execute();

        foreach ($sth->fetchAll() as $row) {
            return "true";
        }
        return "false";
    }

    public function findIdeaIdByContentAndParent($parent, $content) {
        $sth = Database::$db->prepare('SELECT id
            FROM idea
            WHERE parent = :parent AND
                  content = :content
            LIMIT 0,1');

        $sth->bindParam(':parent', $parent);
        $sth->bindParam(':content', $content);

        $sth->execute();

        foreach ($sth->fetchAll() as $row) {
            return $row['id'];
        }
        return null;
    }

    public function checkIdeaExists($parent, $content) {

        $id = $this->findIdeaIdByContentAndParent($parent, $content);
        if ($id !== null) {
            return "true";
        }
        return "false";
    }

    public function clearAll() {

        // delete idea
        $stmt2 = Database::$db->prepare('DELETE from idea
        WHERE id > 1 ');
        $stmt2->execute();
    }

}
