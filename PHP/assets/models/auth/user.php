<?php

namespace App\Models\Auth;

use App\Utilities\Authorization;
require_once __DIR__ . "/../../../vendor/autoload.php";
require_once __DIR__ . "/../../../utilities/tokengenerator.php";
include_once(__DIR__ . '/../../../config/Database.php');

use PDO;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class User {
    private static $db;

    public static function setDatabase(PDO $database) {
        self::$db = $database;
    }

    public function checkUser($email, $password) {
        $stmt = self::$db->prepare("SELECT * FROM users WHERE user_email = :email");
        $stmt->execute(['email' => $email]);
    
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // Debugging statements
            error_log("Fetched User: " . print_r($row, true)); // Log the fetched user
            
            if (password_verify($password, $row['user_password'])) {
                return $row; 
            } else {
                error_log("Password mismatch for email: " . $email); // Log password mismatch
                return "Wrong";
            }
        } else {
            error_log("No user found with email: " . $email); // Log if no user found
            return null;
        }
    }
    

    public function checkAdminEmail($email, $password) {
        $stmt = self::$db->prepare("SELECT email, user_password FROM admin WHERE email = :email");
        $stmt->execute(['email' => $email]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $row['user_password'])) {
                return $row; 
            } else {
                return "Wrong";
            }
        } else {
            return null;
        }
    }

    public static function updateBalance($userId, $newBalance) {
        // PostgreSQL syntax for updating data
        $query = "UPDATE users SET balance = :new_balance WHERE user_id = :user_id";
        $stmt = self::$db->prepare($query);
        $stmt->bindParam(':new_balance', $newBalance);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
    }

    public static function getUserByToken($token) {
        $12345DcodeKey = "Dcode"; 
        $auth = new Authorization($12345DcodeKey);
        $decoded = $auth->authorize($token);  // Call the authorize method

        if ($decoded['status'] === 'success') {
            $userId = $decoded['data']['id'];
            $query = "SELECT * FROM users WHERE user_id = :user_id";
            $stmt = self::$db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }
}
