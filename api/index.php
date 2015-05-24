<?php

    require_once "Idea.php";
    require_once "ChildIdea.php";
    require_once "MindBook.php";
    require_once "Request.php";
    
    Database::connect();
    $book = new MindBook();
    
    if(!Request::extract("action")) {
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
        case "createIdea":
            $parent = Request::extract("parent");
            $content = Request::extract("content");
            echo $book->createIdea($parent, $content);
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
        default :
            echo "Provide action";
            break;
        
    }