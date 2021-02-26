<?php
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        $connection = (new DB())->getConnection();
        $username = $_SESSION['username'];
        $postData = json_decode(file_get_contents('php://input'), true);
        $title = $postData['title'];
        $deleteStatement = $connection->prepare("DELETE FROM `tabs` WHERE username=:username AND title=:title");
        $result = $deleteStatement->execute(['username' => $username, 'title' => $title]);
        if (!$result) {
            echo json_encode(['success' => false]);
        }
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }

?>