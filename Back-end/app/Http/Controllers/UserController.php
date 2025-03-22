<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Symfony\Component\HttpFoundation\Response;


class UserController extends Controller
{
    public function test(Request $request) 
    {
        return 'Hello World';
    }

    public function login(Request $request) 
    {
        $jwtAuth = new JwtAuth();
        $json = $request->input('json', null);
        $params = json_decode($json); // object (php format)
        $params_array = json_decode($json, true); // array

        // check if the data is not empty
        if (!empty($params) && !empty($params_array)) {
            // clean data
            $params_array = array_map('trim', $params_array);

            // validate data
            $validate = Validator::make($params_array, [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            // check if the validation fails
            if ($validate->fails()) {
                $signup = [
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'User not logged in',
                    'errors' => $validate->errors()
                ];
            } else {
                // generate token
                $signup = $jwtAuth->login($params_array['email'], $params_array['password']);
                // check if the token is requested
                if (!empty($params_array['getToken'])) {
                    $signup = $jwtAuth->login($params_array['email'], $params_array['password'], true);
                }
            }
        } else {
            $signup = [
                'status' => 'error',
                'code' => 404,
                'message' => 'User not logged in'
            ];
        }

        // return response in json format with the token and in format of 200 that means everything is ok
        return response()->json($signup, 200);
    }

    public function register(Request $request) 
    {
        // data user from POST
        // json from the front-end
        $json = $request->input('json', null);
        $params = json_decode($json); // object (php format)
        $params_array = json_decode($json, true); // array
        
        // check if the data is not empty
        if (!empty($params) && !empty($params_array)) {
            // clean data
            $params_array = array_map('trim', $params_array);

            // validate data
            $validate = Validator::make($params_array, [
                'name' => 'required|alpha', // alpha is for letters only
                'surname' => 'required|alpha', 
                'email' => 'required|email|unique:users',
                'password' => 'required'
            ]);

            // check if the validation fails
            if ($validate->fails()) {
                $data = [
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'User not created',
                    'errors' => $validate->errors()
                ];
            } else {
                // create user
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                //$user->password = hash('sha256', $params_array['password']);
                $user->password = password_hash($params_array['password'], PASSWORD_BCRYPT);
                $user->role = 'ROLE_USER';

                // save user
                $user->save();

                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'User created successfully',
                    'user' => $user,
                ];
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'User not created'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function update(Request $request) 
    {
        // check if the user is authenticated
        $token = $request->header('Authorization');
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        // recive data
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // check if the user is authenticated
        if ($checkToken && !empty($params_array)) {
            // get user data
            $user = $jwtAuth->checkToken($token, true);

            // validate data
            $validate = Validator::make($params_array, [
                'name' => 'required|alpha', // alpha is for letters only
                'surname' => 'required|alpha', 
                'email' => 'required|email|unique:users,'.$user->sub, // check if the email is unique
            ]);

            // remove the fields that we do not want to update
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);

            // update user in db
            $user_update = User::where('id', $user->sub)->update($params_array);

            // return response
            $data = [
                'code' => 200,
                'status' => 'success',
                'user' => $user,
                'changes' => $params_array
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'User not updated'
            ];
        }

        return response()->json($data, $data['code']);

    }

    public function upload(Request $request) 
    {
        // get data
        $image = $request->file('file0');

        // validate image
        $validate = Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        // save image
        if (!$image || $validate->fails()) {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Error uploading image'
            ];
        } else {
            $image_name = time().$image->getClientOriginalName();
            Storage::disk('users')->put($image_name, File::get($image));

            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            ];
        }

        // return response in text format
        return response($data, $data['code'])->header('Content-Type', 'text/plain');
    }

    public function getImage($filename) 
    {
        // check if the image exists
        $isset = Storage::disk('users')->exists($filename);

        if ($isset) {
            $file = Storage::disk('users')->get($filename);
            return new Response($file, 200);
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'Image not found'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function detail($id) 
    {
        $user = User::find($id);

        if (is_object($user)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'user' => $user
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'User not found'
            ];
        }

        return response()->json($data, $data['code']);
    }

    public function logout(Request $request) 
    {
        // Verificar si el token está presente en el encabezado
        $token = $request->header('Authorization');

        if (!$token) {
            return response()->json([
                'message' => 'Token no proporcionado'
            ], 401);
        }

        try {
            // Decodificar el token
            $jwtAuth = new JwtAuth();
            $decoded = JWT::decode($token, new Key($jwtAuth->key, 'HS256'));

            // Opcional: Aquí podrías manejar un "blacklist" para invalidar tokens manualmente
            return response()->json([
                'message' => 'Cierre de sesión exitoso'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Token inválido o expirado'
            ], 401);
        }
    }
}
