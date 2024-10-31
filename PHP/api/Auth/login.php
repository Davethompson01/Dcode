<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once(__DIR__ . "/../../assets/controllers/login.php");
require_once(__DIR__ . "/../../assets/routes/login.php");

use App\Models\LoginRoute;

$loginRoute = new LoginRoute();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $loginRoute->handleLogin();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
