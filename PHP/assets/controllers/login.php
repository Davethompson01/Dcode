<?php

namespace App\Controllers;

require_once __DIR__ . "/../models/auth/user.php";
require_once __DIR__ . "/../models/auth/login.php";
require_once __DIR__ . "/../../utilities/tokengenerator.php";
require_once __DIR__ . "/../../utilities/authorisation.php";

use App\Models\Auth\Login;
use App\Models\Auth\User;
use App\Utilities\TokenGenerator;
use App\Utilities\Authorization;

class LoginController {
    private $userModel;
    private $tokenGenerator;
    private $authorization;

    public function __construct(User $userModel, TokenGenerator $tokenGenerator, Authorization $authorization) {
        $this->userModel = $userModel;
        $this->tokenGenerator = $tokenGenerator;
        $this->authorization = $authorization;
    }

    public function handleLogin($email, $password) {
        // Check if the email belongs to a user
        $user = $this->userModel->checkUser($email, $password);
        
        // If not found as a user, check if it's an admin
        if (!$user) {
            $user = $this->userModel->checkAdminEmail($email, $password);
            if ($user) {
                $user['role'] = 'admin'; // Set role as admin if found in admin table
            }
        } else {
            $user['role'] = 'user'; // Set role as user if found in users table
        }
    
        // If neither user nor admin found, return error
        if (!$user) {
            return [
                'status' => 'error',
                'message' => 'Invalid email or password.'
            ];
        }
    
        // Extract user details and assign proper username and role
        $userId = $user['id'] ?? null;
        $username = $user['username'] ?? $email; // Use email if username is null
        $userRole = $user['role']; // User role is set by the check above
        
        // Generate the token with correct role
        $jwtToken = $this->tokenGenerator->generateToken(
            $userId, 
            $username, 
            $email, 
            $userRole
        );
    
        // Return response with user details and token
        return [
            'status' => 'success',
            'message' => 'Login successful.',
            'token' => $jwtToken,
            'username' => $username, // This will no longer be "guest"
            'role' => $userRole,
            'user_details' => $user
        ];
    }
    
    

    // Optional authorization-based profile retrieval
    // public function getProfile($request) {
    //     $token = $request['token'];
    //     $authResponse = $this->authorization->authorize($token);
    //
    //     if ($authResponse['status'] === 'error') {
    //         return ['status' => 'error', 'message' => $authResponse['message']];
    //     }
    //
    //     $userData = $authResponse['data'];
    //     return ['status' => 'success', 'message' => 'Profile retrieved.', 'user' => $userData];
    // }
}
