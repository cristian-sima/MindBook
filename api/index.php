<?php

    require "Idea.php";
    require "MindBook.php";
    require "Request.php";
    
    Database::connect();
    $book = new MindBook();
    
    if(!Request::extract("action")) {
        die("Please tell me the action");
    }
    
    switch (Request::extract("action")) {
        case "getHomeIdeaID":            
            echo $book->getHomeIdeaID();
            break;
        case "getIdea":
            $id = Request::extract("id");
            echo $book->getIdea($id);
            break;
            break;
        case "getAllChildrenOfIdea":
            $id = Request::extract("id");
            echo $book->getAllChildrenOfIdea($id);
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
        default :
            echo "It is working";
            break;
        
    }