<?php

namespace App\Helpers;
use Firebase\JWT\JWT;
use App\Models\User;
use Firebase\JWT\Key;
use UnexpectedValueException;
use DomainException;

class JwtAuth
{
    public $key;

    public function __construct()
    {
        $this->key
            = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4v6J9J9Q';
    }

    // Auth the user with the token
    public function login($email, $password, $getToken = null)
    {
        // Search if the user exists
        $user = User::where(
            'email', $email,
            //'password', $password
            // the password is not needed here because it is already hashed and can not be compared
            )->first();

        // Check if the user exists
        if (is_object($user) && password_verify($password, $user->password)) {
            // Generate the token
            $token = [
                'sub' => $user->id, // sub is the user id on jwt
                'email' => $user->email,
                'name' => $user->name,
                'surname' => $user->surname,
                'role' => $user->role,
                'description' => $user->description,
                'image' => $user->image,
                'iat' => time(), // iat is the time the token was generated on jwt
                'exp' => time() + (7 * 24 * 60 * 60), // exp is the time the token expires on jwt
                                                      // 7 days * 24 hours * 60 minutes * 60 seconds
            ];

            // Generate the token
            $jwt = JWT::encode($token, $this->key, 'HS256'); // HS256 is the encryption method

            // Decode the token
            $decoded = JWT::decode($jwt, new Key($this->key, 'HS256'));

            // Return the token
            if (is_null($getToken)) {
                return $jwt;
            } else {
                return $decoded;
            }
        } else {
            // Return an error
            return [
                'status' => 'error',
                'message' => 'Login failed',
            ];
        }
    }

    // Check if the token is valid
    public function checkToken($jwt, $getIdentity = false)
    {
        $auth = false;

        try {
            //clean the token
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, new Key($this->key, 'HS256'));
        } catch (UnexpectedValueException $e) { // token is invalid
            $auth = false;
        } catch (DomainException $e) { // token is invalid
            $auth = false;
        }

        if (!empty($decoded) && is_object($decoded) && isset($decoded->sub)) {
            $auth = true;
        } else {
            $auth = false;
        }

        if ($getIdentity) {
            return $decoded;
        }

        return $auth;
    }
}