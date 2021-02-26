<?php
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    $postData = json_decode(file_get_contents('php://input'), true);
    $_SESSION['title'] = $postData['title'];
?>