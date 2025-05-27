<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Response;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\Responxe;

class CommentController extends Controller implements HasMiddleware
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
        //recieve de data of a video
        $json = $request->input('json', null);
        //convert data to array
        $params_array = json_decode($json, true);

        // if the array is not empty
        if (!empty($params_array)) {
            // get the identity of the user
            $user = $this->getIdentity($request);

            // validate the data
            $validate = Validator::make($params_array, [
                'comment' => 'required',
                'video_id' => 'required',
                'title' =>'required'
            ]);
            
            // if image data is not exists
            if (!isset($params_array['image'])) {
                $params_array['image'] = null;
            }

            // if it fails
            if ($validate->fails()) {
                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'The comment could not be saved',
                );
            } else {
                // if it is correct
                $comment = new Comment();
                $comment->user_id = $user->sub;
                $comment->video_id = $params_array['video_id'];
                $comment->title = $params_array['title'];
                $comment->comment = $params_array['comment'];
                $comment->image = $params_array['image'];
                // save the comment
                $comment->save();
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'The comment has been saved',
                    'comment' => $comment
                ];
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'The comment could not be saved',
            ];
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // get all comments of a video
        $comments = Comment::all()->where('video_id', $id);
        
        $users = [];
        $commentsArray = [];
        $response_cont = [];

        foreach ($comments as $comment) {
            //the user that made the comment
            array_push($users, $comment->user);

            // the comment
            array_push($commentsArray, $comment);

            // responsesof the comment
            array_push($response_cont, $comment->responses->count());
        }

        // if there are comments
        if ($comments->count() > 0) {
            $data = [
                'status' => 'success',
                'code' => 200,
                'comments' => $commentsArray,
                'cont' => $comments->count(),
                'response_cont' => $response_cont,
                'users' => $users
            ];
        } else {
            $data = [
                'status' => 'success',
                'code' => 200,
                'state' => 'empty',
                'message' => 'There are no comments',
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
        // recieve the data from POST
        $json = $request->input('json', null);
        // convert data to array
        $params_array = json_decode($json, true);

        //if the array is not empty
        if (!empty($params_array)) {
            // validate the data
            $validate = Validator::make($params_array, [
                'comment' =>'required',
                'title' =>'required'
            ]);
            
            // if it fails
            if ($validate->fails()) {
                $data = array(
                   'status' => 'error',
                    'code' => 404,
                   'message' => 'The comment could not be updated',
                );
            } else {
                // if it is correct
                unset($params_array['id']);
                unset($params_array['user_id']);
                unset($params_array['created_at']);
                unset($params_array['user']);

                // get the identity of the user
                $user = $this->getIdentity($request);

                // get the comment
                $comment = Comment::where('id', $id)
                    ->where('user_id', $user->sub)
                    ->first();

                // if the comment exists
                if (!empty($comment) && is_object($comment)) {
                    // update the comment
                    $comment->update($params_array);
                    // result
                    $data = [
                        'status' =>'success',
                        'code' => 200,
                        'message' => 'The comment has been updated',
                        'comment' => $comment,
                        'changes' => $params_array,
                        'user' => $user
                    ];
                } else {
                    $data = [
                      'status' => 'error',
                        'code' => 404,
                      'message' => 'The comment does not exist',
                    ];
                }
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'Data is not correct'
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
            Storage::disk('comments')->put($image_name, File::get($image));

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
        $isset = Storage::disk('comments')->exists($filename);

        if ($isset) {
            $file = Storage::disk('comments')->get($filename);
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
    public function destroy(string $id)
    {
        //get the comment
        $comment = Comment::where('id', $id)->first();
        //get de response (responxe)
        $response = Responxe::where('comment_id', $id)->first();

        // if the comment exists
        if (!empty($comment)) {
            // delete the response
            $comment->responses()->delete();
            // delete the comment
            $comment->delete();
            $data = [
                'status' =>'success',
                'code' => 200,
                'message' => 'The comment has been deleted',
                'comment' => $comment
            ];
        } else {
            $data = [
                'status' =>'error',
                'code' => 404,
                'message' => 'The comment does not exist',
                'comment' => $comment,
                'response' => $response
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
