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

        $report = array();

        $id = Request::extract("id");
        $newContent = Request::extract("content");
        $parentID = Request::extract("parent");
        $requestId = Request::extract("requestId");
                $childrenJSON = Request::extract("children");

        $book->updateIdea($id, $newContent, $parentID, $requestId, $childrenJSON);

        break;

    case "removeIdea":
        $id = Request::extract("id");
        $ideaExists = $book->checkIdeaExistsById($id);

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