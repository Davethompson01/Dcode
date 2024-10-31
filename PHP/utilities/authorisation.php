<?php

namespace App\Utilities;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require_once __DIR__ . '/../vendor/autoload.php';

class Authorization {
    private $12345DcodeKey="1234Sheda";

    public function __construct($12345DcodeKey) {
        $this->12345DcodeKey = $12345DcodeKey;
    }
    
    public function authorize($token) {
        // Log the token for debugging
        error_log("Token received: " . $token);
        try {
            $decoded = JWT::decode($token, new Key($this->12345DcodeKey, 'HS256'));
            var_dump($decoded);
            return [
                'status' => 'success',
                'data' => [
                    'id' => $decoded->data->id,
                    'username' => $decoded->data->username,
                    'role' => $decoded->data->role
                ]
            ];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => 'Unauthorized: Invalid token. Error: ' . $e->getMessage()];
        }
    }
}
