<?php 
    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        include './config.php';
        $dsn = "mysql:host=$_dbHost;port=$_dbPort";
        $connection = new PDO($dsn, $_dbUsername, $_dbPassword);
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $createDBStatement = "CREATE DATABASE $_dbName";
        $result = $connection->exec($createDBStatement);
        if (!$result) {
            echo json_encode(['success' => false]);
        } else {
            $useDBStatement = "USE $_dbName";
            $connection->exec($useDBStatement);

            $createUsersTableStatement = "CREATE TABLE `$_dbName`.`users` 
                                        ( `username` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL , 
                                        `password` VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL , 
                                        PRIMARY KEY (`username`))
                                        ENGINE = InnoDB;";
            $connection->exec($createUsersTableStatement);

            $createTabsTableStatement = "CREATE TABLE `$_dbName`.`tabs` 
                                        ( `id` INT NOT NULL AUTO_INCREMENT , 
                                        `username` VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL , 
                                        `title` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL , 
                                        `tab` VARCHAR(100000) NOT NULL DEFAULT '{\"__frames\":[{\"__notes\":[{\"__time\":1,\"__singleNotes\":[null,null,null,null,null,null]}]}]}' , 
                                        PRIMARY KEY (`id`),
                                        FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE CASCADE,
                                        UNIQUE(`username`, `title`))
                                        ENGINE = InnoDB;";
            $connection->exec($createTabsTableStatement);
        }
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
    
?>