<?php

namespace App\Models;

require_once(__DIR__ . "/../../config/Database.php");
require_once(__DIR__ . "/../models/auth/Signup.php");
require_once(__DIR__ . "/../views/login.php");
require_once(__DIR__ . "/../models/auth/user.php");
require_once(__DIR__ . "/../models/auth/login.php");
require_once(__DIR__ . "/../../utilities/TokenGenerator.php");
require_once(__DIR__ . "/../../utilities/authorisation.php");

use App\Controllers\LoginController;
use App\Models\Auth\User;
use App\Models\Auth\Signup;
use App\Controllers\LoginView;
use App\Config\Database;
use App\Utilities\TokenGenerator;
use App\Utilities\Authorization;
class LoginRoute {
    private $loginController;
    private $loginView;
    private $userModel;

    public function __construct() {
        // Create database connection
        $database = new Database();
        $db = $database->getConnection(); // Get the PDO connection

        // Set the database connection for User model
        User::setDatabase($db); // Use the static method to set the database connection
        
        // Initialize the User model without passing the database connection
        $this->userModel = new User(); 
        
        // Initialize other models and dependencies
        $tokenGenerator = new TokenGenerator();
        $authorization = new Authorization('12345DCODE'); // Add your 12345Dcode key here

        // Pass all dependencies to the LoginController
        $this->loginController = new LoginController($this->userModel, $tokenGenerator, $authorization);
        $this->loginView = new LoginView();
    }

    public function handleLogin() {
        // Get input from request body (JSON)
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        // Check if email and password are provided
        if (empty($email) || empty($password)) {
            $response = ['status' => 'error', 'message' => 'Empty email or password'];
        } else {
            // Delegate to the login controller
            $response = $this->loginController->handleLogin($email, $password);
        }

        // Render the response via the view
        $this->loginView->render($response);
    }
}
