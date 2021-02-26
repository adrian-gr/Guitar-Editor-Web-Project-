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
        $selectStatement = $connection->prepare("INSERT INTO `tabs`(`username`, `title`) VALUES (:username, :title)");
        $result = $selectStatement->execute(['username' => $username, 'title' => $title]);
        if (!$result) {
            echo json_encode(['success' => false]);
            return;
        }
        $_SESSION['title'] = $title;
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
?>