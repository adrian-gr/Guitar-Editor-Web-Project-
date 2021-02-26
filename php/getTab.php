<?php 
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        $connection = (new DB())->getConnection();
        $username = $_SESSION['username'];
        $title = $_SESSION['title'];
        $selectStatement = $connection->prepare("SELECT tab FROM `tabs` WHERE username=:username AND title=:title");
        $result = $selectStatement->execute(['username' => $username, 'title' => $title]);
        if (!$result) {
            echo json_encode(['success' => false]);
        }
        $tab = $selectStatement->fetch();
        echo json_encode(['success' => true, 'tab' => $tab]);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
?>