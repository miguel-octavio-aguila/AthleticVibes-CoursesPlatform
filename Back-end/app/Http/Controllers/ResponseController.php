<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\Responxe;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Validator;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class ResponseController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: ['show', 'getImage']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // recieve the data from POST
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the array is not empty
        if (!empty($params_array)) {
            // get the user identity
            $user = $this->getIdentity($request);

            // validate the data
            $validate = Validator::make($params_array, [
                'comment_id' => 'required',
                'response' => 'required',
            ]);

            // if we don't have an image from the request
            if (!isset($params_array['image'])) {
                $params_array['image'] = null;
            }

            // if the validation fails
            if ($validate->fails()) {
                $data = [
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Incorrect data',
                ];
            } else {
                // save the response
                $response = new Responxe();
                $response->user_id = $user->sub;
                $response->comment_id = $params_array['comment_id'];
                $response->response = $params_array['response'];
                $response->image = $params_array['image'];
                $response->save();

                // return the response
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'The response has been saved',
                    'response' => $response,
                ];
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 400,
                'message' => 'The response is not valid',
            ];
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //get the comment
        $comment = Comment::where('id', $id)->first();
        
        // arrays
        $users = [];
        $responses = [];

        foreach ($comment->responses as $response) {
            // save de reponse 
            array_push($responses, $response);
            // save the user
            array_push($users, $response->user);
        }

        // if a response exists
        if ($comment->responses->count() > 0) {
            $data = [
                'status' => 'success',
                'code' => 200,
                'message' => 'The response has been found',
                'comment' => $comment,
                'users' => $users,
                'responses' => $responses,
                'cont' => $comment->responses->count(),
                'creates_at' => $comment->created_at,
                'user' => $comment->user
            ];
        } else {
            $data = [
                'status' => 'error',
                'code' => 400,
                'message' => 'The response does not exist',
            ];
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //recieve de data from PUT 
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the array is not empty
        if (!empty($params_array)) {
            // validate the data
            $validate = Validator::make($params_array, [
                'comment_id' =>'required',
                'response' =>'required',
            ]);

            // if the validation fails
            if ($validate->fails()) {
                $data = [
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Incorrect data',
                ];
            } else {
                // update the response
                unset($params_array['id']);
                unset($params_array['created_at']);
                unset($params_array['user_id']);
                unset($params_array['user']);

                // get the user identity
                $user = $this->getIdentity($request);

                // get the response
                $response = Responxe::where('id', $id)
                    ->where('user_id', $user->sub)
                    ->first();

                // if the response exists
                if (!empty($response) && is_object($response)) {
                    // update the response
                    $response->update($params_array);

                    // return the response
                    $data = [
                        'status' =>'success',
                        'code' => 200,
                        'message' => 'The response has been updated',
                        'response' => $response,
                    ];
                } else {
                    $data = [
                        'status' => 'error',
                        'code' => 400,
                        'message' => 'The response does not exist',
                    ];
                }
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'The data is not valid',
            ];
        }

        return response()->json($data, $data['code']);
    }

    // upload de image
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
            Storage::disk('responses')->put($image_name, File::get($image));

            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            ];
        }

        // return response in text format
        return response($data, $data['code'])->header('Content-Type', 'text/plain');
    }

    // get image
    public function getImage($filename) 
    {
        // check if the image exists
        $isset = Storage::disk('responses')->exists($filename);

        if ($isset) {
            $file = Storage::disk('responses')->get($filename);
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        //get the user identity
        $user = $this->getIdentity($request);

        // get the response
        $response = Responxe::where('id', $id)
            ->where('user_id', $user->sub)
            ->first();

        // if the response exists
        if (!empty($response)) {
            // delete the response
            $response->delete();
            $data = [
              'status' =>'success',
                'code' => 200,
              'message' => 'The response has been deleted',
            ];
        } else {
            $data = [
             'status' => 'error',
                'code' => 400,
             'message' => 'The response does not exist',
            ];
        }

        return response()->json($data, $data['code']);
    }

    // get the identity of the user
    private function getIdentity(Request $request)
    {
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);
        return $user;
    }
}
