<?php

require_once "Idea.php";
require_once "ChildIdea.php";
require_once "MindBook.php";
require_once "Request.php";

Database::connect();
$book = new MindBook();

if (!Request::extract("action")) {
    die("Please tell me the action");
}

switch (Request::extract("action")) {
    case "getHomeIdeaID":
        echo $book->getHomeIdeaID();
        break;
    case "getCounterIndex":
        echo $book->getCounterIndex();
        break;
    case "init":
        echo $book->getInitData();
        break;
    case "getIdea":
        $id = Request::extract("id");
        $childIdea = new ChildIdea($id);
        $childIdea->getChildren();
        echo $childIdea;
        break;
    case "getEntireIdea":
        $id = Request::extract("id");
        $childIdea = new ChildIdea($id);
        $childIdea->getAllChildren();
        echo $childIdea;
        break;
    case "findIdeas":
        $term = Request::extract("term");
        echo $book->findIdeas($term);
        break;
    case "createIdea":
        break;
    case "changeIdeaContent":
        break;
    case "updateIdea":

        $report = array("isCorrelated" => false);

        $id = Request::extract("id");
        $newContent = Request::extract("content");
        $parentID = Request::extract("parent");

        $currentIdExists = $book->checkIdeaExistsById($id);
        $similarIdeaExits = $book->checkIdeaExists($parentID, $newContent);

        if ($similarIdeaExits) {
            if ($currentIdExists) {
                // change the children to the new one
                // delete it
                // mark it as the corresponding
                $oldIdea = new ChildIdea($id);

                $correspondingIdea = $book->findIdeaByContentAndParent($parentID, $newContent);

                $oldIdea->changeParentOfChildren($correspondingIdea->getId(), $correspondingIdea->getPath());

                $oldIdea->delete();
            }

            $report["status"] = "correspondence";
            $report["id"] = $correspondingIdea->getId();

            // change parent of the children to the new one 
        } else {
            // the id is not
            if ($currentIdExists) {
                $result = $book->createIdea($parentID, $newContent, $id);
                $report["status"] = "created";
            } else {
                $report["status"] = "updated";
                $oldIdea = new ChildIdea($id);
                
                // UPDATE IT
                $oldIdea->setContent($newContent);
                $oldIdea->setParent($parent);
            }
                $report["id"] = $id;
        }

        echo json_encode($report);

        break;

    case "removeIdea":
        $id = Request::extract("id");
        $ideaExists = $book->checkIdeaExists($id);

        if ($ideaExists) {
            $idea = new ChildIdea($id);
            echo $idea->remove();
        } else {
            echo 'false';
        }
        break;
    /* to delete */
    case "clear":
        $book->clearAll();
        echo '<meta http-equiv="refresh" content="0; url=../" />';
        break;
    default :
        echo "Provide action!";
        break;
}