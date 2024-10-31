<?php

namespace App\Models\Auth;

require_once(__DIR__ . "/../../../config/Database.php");

use App\Config\Database;
use PDO;
use Exception;

class Signup {
    private $connection;

    public function __construct(Database $database) {
        $this->connection = $database->getConnection(); // Use the connection from the passed database object
    }

    private function hashPassword($password): string {
        return password_hash($password, PASSWORD_ARGON2ID);
    }

    public function checkEmail(string $email): bool {
        $query = "
        SELECT email FROM admin WHERE email = :email
        UNION
        SELECT user_email AS email FROM users WHERE user_email = :email
        ";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }

    public function createUser(array $data): ?int {
        try {
            $query = "INSERT INTO users (username, user_email, user_password, user_phone_number, user_location, ip_address, user_type) 
                      VALUES (:username, :user_email, :user_password, :user_phone_number, :user_location, :ip_address, :user_type)";
            $stmt = $this->connection->prepare($query);

            if (empty($data['password'])) {
                throw new Exception('Password is required');
            }

            $hashedPassword = $this->hashPassword($data['password']);
            $userType = 'user';

            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':user_email', $data['email']);
            $stmt->bindParam(':user_password', $hashedPassword);
            $stmt->bindParam(':user_phone_number', $data['number']);
            $stmt->bindParam(':user_location', $data['location']);
            $stmt->bindParam(':ip_address', $data['ip_address']);
            $stmt->bindParam(':user_type', $userType);

            if ($stmt->execute()) {
                return $this->connection->lastInsertId();
            } else {
                error_log("User creation failed for email: {$data['email']}");
                return null;
            }
        } catch (Exception $e) {
            error_log("Error in createUser: " . $e->getMessage());
            return null;
        }
    }

    public function createAdminUser(array $data): ?int {
        try {
            $query = "INSERT INTO admin (username, email, user_password, phone_number, ip_address, user_type) 
                      VALUES (:username, :email, :user_password, :phone_number, :ip_address, :user_type)";
            
            $stmt = $this->connection->prepare($query);
            
            if (empty($data['password'])) {
                throw new Exception('Password is required');
            }

            $hashedPassword = $this->hashPassword($data['password']);
            $userType = 'admin';

            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':user_password', $hashedPassword);
            $stmt->bindParam(':phone_number', $data['number']); 
            $stmt->bindParam(':ip_address', $data['ip_address']);
            $stmt->bindParam(':user_type', $userType);
                
            if ($stmt->execute()) {
                return $this->connection->lastInsertId();
            } else {
                error_log("Admin user creation failed for email: {$data['email']}");
                return null;
            }
        } catch (Exception $e) {
            error_log("Error in createAdminUser: " . $e->getMessage());
            return null;
        }
    }

    public function updateToken(int $userId, string $token): bool {
        try {
            $query = "UPDATE admin SET user_token = :user_token WHERE admin_id = :admin_id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':user_token', $token);
            $stmt->bindParam(':admin_id', $userId);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error in updateToken: " . $e->getMessage());
            return false;
        }
    }

    public function updateTokenUser(int $userId, string $token): bool {
        try {
            $query = "UPDATE users SET user_token = :user_token WHERE user_id = :user_id";
            $stmt = $this->connection->prepare($query);
            $stmt->bindParam(':user_token', $token);
            $stmt->bindParam(':user_id', $userId);
            return $stmt->execute();
        } catch (Exception $e) {
            error_log("Error in updateTokenUser: " . $e->getMessage());
            return false;
        }
    }
}
