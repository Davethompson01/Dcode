<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private $host = 'localhost';     // Database host
    private $db_name = 'Dcode';      // Database name
    private $username = 'dcode'; // PostgreSQL username
    private $password = 'dcode'; // PostgreSQL password
    private $connection;

    public function getConnection()
    {
        $this->connection = null;
        
        try {
            // Connect to PostgreSQL with the provided username and password
            $this->connection = new PDO("pgsql:host={$this->host};dbname={$this->db_name}", $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo "Connected successfully to PostgreSQL!";
            
        } catch (PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->connection;
    }
}

// Create a new instance of the Database class and attempt to connect
$db = new Database();
$connection = $db->getConnection();
