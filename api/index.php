<?php

require_once "Idea.php";
require_once "ChildIdea.php";
require_once "MindBook.php";
require_once "Request.php";
require_once "Software.php";

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
        $level = Request::extract("level");
        $childIdea = new ChildIdea($id);
        $childIdea->getChildren($level);
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

        $software = new Software($book);

        $content = Request::extract("content");
        $parent = Request::extract("parent");
        $requestId = Request::extract("requestId");
        $id = Request::extract("id");
        $children = Request::extract("children");


        $clientIdea = array(
            "id" => $id,
            "content" => $content,
            "children" => $children,
            "parent" => $parent
        );

        $report["ideas"] = array($software->getIdeaReport($clientIdea));

        $report["requestId"] = $requestId;

        echo json_encode($report);

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