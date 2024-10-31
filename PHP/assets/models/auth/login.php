<?php
namespace App\Models\Auth;
use PDO;
use Exception;

class Login {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function checkUser($email, $password) {
        if ($this->db === null) {
            throw new Exception("Database connection not established.");
        }

        // // Check the users table for regular users
        // $stmt = $this->db->prepare("SELECT user_id, username, user_password, 'user' AS user_type FROM users WHERE user_email = :email");
        // $stmt->execute(['email' => $email]);
        
        // if ($stmt->rowCount() > 0) {
        //     $row = $stmt->fetch(PDO::FETCH_ASSOC);
        //     if (password_verify($password, $row['user_password'])) {
        //         return [
        //             'id' => $row['user_id'],
        //             'username' => $row['username'],
        //             'role' => 'user'
        //         ];
        //     } else {
        //         error_log("Password mismatch for user with email: $email");
        //         return "Wrong";
        //     }
        // }

        // Check the admin table for admin users
        $stmt = $this->db->prepare("SELECT admin_id, username, user_password, 'admin' AS user_type FROM admin WHERE email = :email");
        $stmt->execute(['email' => $email]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($password, $row['user_password'])) {
                return [
                    'id' => $row['admin_id'],
                    'username' => $row['username'],
                    'role' => 'admin'
                ];
            } else {
                error_log("Password mismatch for admin with email: $email");
                return "Wrong";
            }
        }

        // Log if no user or admin found with the email
        error_log("No user or admin found with email: $email");
        return null;
    }
}
