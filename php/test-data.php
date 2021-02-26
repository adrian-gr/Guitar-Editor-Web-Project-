<?php 
    spl_autoload_register(function($className) {
        require_once("./$className.php");
    });

    try {
        include './config.php';
        $dsn = "mysql:host=$_dbHost;dbname=$_dbName";
        $connection = new PDO($dsn, $_dbUsername, $_dbPassword);
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $username = 'test';
        $password = '1234';
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $registerStatement = "INSERT INTO users VALUES ('$username', '$hashed_password')";
        $result = $connection->exec($registerStatement);
        $title = 'Nothing Else Matters';
        $tab = '{"__frames":[{"__notes":[{"__time":2,"__singleNotes":[null,null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":["0",null,null,null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":2,"__singleNotes":[null,null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":["0",null,null,null,null,null]},{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":["0",null,null,null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":2,"__singleNotes":[null,null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":["0",null,null,null,null,null]},{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":["7",null,null,null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":["7",null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":1,"__singleNotes":["7","0",null,null,null,null]},{"__time":1,"__singleNotes":["0",null,null,null,null,null]}]},{"__notes":[{"__time":2,"__singleNotes":[null,"0",null,null,null,null]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]},{"__time":2,"__singleNotes":[null,null,null,null,null,"0"]},{"__time":2,"__singleNotes":[null,null,"0",null,null,null]}]},{"__notes":[{"__time":1,"__singleNotes":["7","0",null,null,null,null]}]}]}';
        $tab = json_encode(json_decode($tab));
        $insertTabStatement = "INSERT INTO tabs(username, title, tab) VALUES('$username', '$title', '$tab')";
        $result = $connection->exec($insertTabStatement);
    } catch (PDOException $e) {
        echo ($e->getMessage());
    }
    
?>