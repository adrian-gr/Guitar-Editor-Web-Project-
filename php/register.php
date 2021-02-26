<?php
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    function register(array $registerData) {
        try {
            $connection = (new DB())->getConnection();
            $username = $registerData['username'];
            $password = $registerData['password'];
            $confirm_password = $registerData['confirm_password'];
            
            $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE username=:username");
            $result = $selectStatement->execute(['username' => $username]);
            
            if (!$result) {
                return null;
            }

            $user = $selectStatement->fetch();
            if ($user) {
                return ['success' => false, 'error' => 'Username already exists!'];
            } else if ($password != $confirm_password) {
                return ['success' => false, 'error' => 'Passwords don\'t match!'];
            } else {
                $connection = (new DB())->getConnection();
                $selectStatement = $connection->prepare("INSERT INTO `users` VALUES (:username, :pass)");

                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $result = $selectStatement->execute(['username' => $username, 'pass' => $hashed_password]);
                return ['success' => true, 'user' => new User($username, $password)];
            }
        } catch (PDOException $e) {
            echo ($e->getMessage());
        }

        return null;
    }

    $postData = json_decode(file_get_contents('php://input'), true);
    $res = register($postData);
    
    if ($res['success']) {
        $_SESSION['username'] = $res['user']->getUsername();
        echo json_encode(['success' => true]);
    } else {
        echo json_encode($res);
    }
?>