<?php
    session_start();
    echo json_encode(isset($_SESSION['username']));
    session_destroy();
?>