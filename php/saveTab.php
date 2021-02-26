<?php 
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        $connection = (new DB())->getConnection();
        $username = $_SESSION['username'];
        $title = $_SESSION['title'];
        $postData = json_decode(file_get_contents('php://input'), true);
        $tab = $postData['tab'];
        $selectStatement = $connection->prepare("UPDATE `tabs` SET tab=:tab WHERE username=:username AND title=:title");
        $result = $selectStatement->execute(['tab' => $tab, 'username' => $username, 'title' => $title]);
        if (!$result) {
            echo json_encode(['success' => false]);
        }
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
?>