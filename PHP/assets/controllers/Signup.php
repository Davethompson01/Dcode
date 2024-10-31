<?php

namespace App\Controllers;

require_once(__DIR__ . "/../../vendor/autoload.php");
require_once(__DIR__ . '/../models/auth/Signup.php');
require_once(__DIR__ . '/../models/auth/user.php');
require_once(__DIR__ . "/../../utilities/tokengenerator.php");
require_once(__DIR__ . "/../Requests/Signuprequest.php");

use App\Config\Database;
use App\Models\Auth\User;
use App\Models\Auth\Signup;
use App\Utilities\TokenGenerator;
use App\Requests\SignupRequest;

class SignupController {
    private $userModel;
    private $signupModel; // Add this line
    private $tokenGenerator;

    public function __construct() {
        $database = new Database(); // Create Database instance
        $this->signupModel = new Signup($database); // Pass the Database instance
        $db = $database->getConnection(); // Get the PDO connection
        User::setDatabase($db); // Set the database connection for User model
        $this->userModel = new User(); // Create an instance of User
        $this->tokenGenerator = new TokenGenerator();
    }

    public function handleSignup() {
        $this->processSignup(false);
    }

    public function handleAdminSignup() {
        $this->processSignup(true);
    }

    private function processSignup($isAdminSignup) {
        header('Content-Type: application/json');
        $signupRequest = new SignupRequest();
        $data = $signupRequest->validateSignupData();
        $data['ip_address'] = $this->getIpAddress();

        if (!$data) {
            return; // Errors handled in the request class
        }

        // Call the checkEmail method from the Signup model
        if ($this->signupModel->checkEmail($data['email'])) {
            $this->sendResponse(['status' => 'error', 'message' => 'Email already taken.']);
            return;
        }

        $userId = $isAdminSignup ? $this->signupModel->createAdminUser($data) : $this->signupModel->createUser($data);
        
        if ($userId) {
            $token = $this->tokenGenerator->generateToken($userId, $data['username'], $data['email'], $isAdminSignup);
            $this->signupModel->updateToken($userId, $token);

            $this->sendResponse([
                'status' => 'success',
                'message' => $isAdminSignup ? 'Admin signup successful' : 'Signup successful',
                'id' => $userId,
                'username' => $data['username'],
                'email' => $data['email'],
                'number' => $data['number'],
                'userType' => $isAdminSignup ? 'admin' : 'user',
                'token' => $token,
            ]);
        } else {
            $this->sendResponse(['status' => 'error', 'message' => 'Signup failed. Please try again.']);
        }
    }

    private function getIpAddress() {
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        return filter_var($ipAddress, FILTER_VALIDATE_IP) ? $ipAddress : 'UNKNOWN';
    }

    private function sendResponse(array $response) {
        echo json_encode($response);
        exit;
    }
}
