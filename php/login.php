<?php
    session_start();

    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    function login(array $loginData) {
        try {
            $connection = (new DB())->getConnection();
            $username = $loginData['username'];
            $password = $loginData['password'];
            
            $selectStatement = $connection->prepare("SELECT * FROM `users` WHERE username=:username");
            $result = $selectStatement->execute(['username' => $username]);
            
            if (!$result) {
                return null;
            }

            $user = $selectStatement->fetch();
            if ($user && password_verify($password, $user['password'])) {
                return new User($username, $password);
            }
        } catch (PDOException $e) {
            echo ($e->getMessage());
        }

        return null;
    }

    $postData = json_decode(file_get_contents('php://input'), true);
    // $postData = ['username' => 'Adrian', 'password' => 'qwe123'];
    $user = login($postData);
    if ($user) {
        $_SESSION['username'] = $user->getUsername();
        $success = true;
    } else {
        $success = false;
    }
    
    echo json_encode(['success' => $success]);
?>