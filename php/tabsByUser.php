<?php
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        $connection = (new DB())->getConnection();
        $username = $_SESSION['username'];
        $selectStatement = $connection->prepare("SELECT title FROM `tabs` WHERE username=:username");
        $result = $selectStatement->execute(['username' => $username]);
        if (!$result) {
            return null;
        }
        $tabs = $selectStatement->fetchAll();
        echo json_encode($tabs);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
?>