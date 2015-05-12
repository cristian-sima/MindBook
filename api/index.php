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
        default :
            echo "It is working";
            break;
    }