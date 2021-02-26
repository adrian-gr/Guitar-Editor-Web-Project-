<?php 
    class DB {
        private PDO $connection;
        
        public function __construct() {
            include './config.php';
            
            $dsn = "mysql:host=$_dbHost;port=$_dbPort;dbname=$_dbName";
            $this->connection = new PDO($dsn, $_dbUsername, $_dbPassword, 
                [
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
        }

        public function getConnection(): PDO {
            return $this->connection;
        }
    };
?>