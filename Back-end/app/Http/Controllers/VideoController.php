<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\Video;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use App\Models\Checkbox;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class VideoController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: ['index', 'show', 'getVideos', 'getVideosByCourse']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $videos = Video::paginate(15)->load('course');
        $video_paginate = Video::paginate(15);
        return response()->json([
            'code' => 200,
            'satus' => 'success',
            'videos' => $videos,
            'video_paginate' => $video_paginate,
        ]);
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
        //recive de data from post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);

        // if the data is not null
        if (!empty($params_array)) {
            // get the identity of the user
            $user = $this->getIdentity($request);

            // validate the data
            $validate = Validator::make($params_array, [
                'user_id' => 'required',
                'course_id' => 'required',
                'title' => 'required',
                'content' => 'required',
                'url' => 'required',
                'section' => 'required',
            ]);

            // if the data fails
            if ($validate->fails()) {
                return response()->json($validate->errors(), 400);
            } else {
                // be sure that the file and accordion_title are set
                $params_array['file'] = $params_array['file'] ?? null;
                $params_array['accordion_title'] = $params_array['accordion_title'] ?? null;
                
                // save the data
                $video = new Video();
                $video->user_id = $params_array['user_id'];
                $video->course_id = $params_array['course_id'];
                $video->title = $params_array['title'];
                $video->content = $params_array['content'];
                $video->url = $params_array['url'];
                $video->section = $params_array['section'];
                $video->file = $params_array['file'];
                $video->accordion_title = $params_array['accordion_title'];
                $video->save();

                
                return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'video' => $video,
                ]);
            }
        } else {
            return response()->json([
                'code' => 400,
                'status' => 'error',
                'message' => 'Data is not valid',
                'error' => 'Data validation not performed',
                'params_array' => $params_array,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // get the video
        $video = Video::find($id)->load('user');

        // if the video exists
        if (is_object($video)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'video' => $video,
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'Video not found',
            ];
        }

        return response()->json($data);
    }

    // get the identity of the user
    private function getIdentity(Request $request) 
    {
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checkToken($token, true);
        return $user;
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
        //recieve the data from the post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the data is not null
        if (!empty($params_array)) {
            // validate the data
            $validate = Validator::make($params_array, [
                'course_id' => 'required',
                'title' => 'required',
                'content' => 'required',
                'url' => 'required',
                'section' => 'required',
            ]);

            // if the data fails
            if ($validate->fails()) {
                return response()->json($validate->errors(), 400);
            } else {
                // remove the data that we don't want to update
                unset($params_array['id']);
                unset($params_array['user_id']);
                unset($params_array['created_at']);
                unset($params_array['user']);

                // update the data
                $video = Video::where('id', $id)
                    ->where('user_id', $this->getIdentity($request)->sub)
                    ->first();

                // if the video exists and is an object
                if (!empty($video) && is_object($video)) {
                    $video->update($params_array);

                    $data = [
                        'code' => 200,
                        'status' => 'success',
                        'video' => $video,
                        'user' => $this->getIdentity($request),
                        'changes' => $params_array,
                    ];
                } else {
                    $data = [
                        'code' => 404,
                        'status' => 'error',
                        'message' => 'Video not found',
                    ];
                }
            }
        } else {
            return response()->json([
                'code' => 400,
                'status' => 'error',
                'message' => 'Data is not valid',
            ]);
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        // get auth user
        $user = $this->getIdentity($request);

        // get the video
        $video = Video::where('id', $id)
            ->where('user_id', $user->sub)
            ->first();

        // if the video exists and is an object
        if (!empty($video) && is_object($video)) {
            $video->delete();

            $data = [
                'code' => 200,
                'status' => 'success',
                'video' => $video,
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'Video not found',
            ];
        }

        return response()->json($data, $data['code']);
    }

    // get all videos
    public function getVideos() 
    {
        $videos = Video::with('course')->get();
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'videos' => $videos,
        ]);
    }

    // get the videos by course
    public function getVideosByCourse(string $id)
    {
        $videos = Video::where('course_id', $id)->get();
        
        // view what procentage of the videos are completed
        if(sizeof($videos) > 0) {
            $re = sizeof($videos);
            $result = 100/$re;

            return response()->json([
                'code' => 200,
                'status' => 'success',
                'videos' => $videos,
                'result' => $result,
            ]);
        } else if(sizeof($videos) == 0) {
            return response()->json([
                'code' => 200,
                'status' => 'success',
                'videos' => 0,
                'message' => 0,
            ]);
        } else {
            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Videos not found',
            ]);
        }
    }

    // get videos with the progress of the user
    public function getVideosWithProgress(Request $request, string $id)
    {
        $videos = Video::where('course_id', $id)->get();

        // get auth user
        $user = $this->getIdentity($request);

        // get the progress of the user with checkboxes
        $checkboxes = Checkbox::where('course_id', $id)
            ->where('user_id', $user->sub)
            ->get();

        // for each video with each checkbox
        foreach($videos as $video) {
            foreach($checkboxes as $checkbox) {
                if($video->id == $checkbox->video_id) {
                    $video->checkbox = 'activated';
                    $video->checkbox_id = $checkbox->id;
                }
            }
        }

        // view what procentage of the videos are completed
        if(sizeof($videos) > 0) {
            $re = sizeof($videos);
            $result = 100/$re;

            return response()->json([
                'code' => 200,
                'status' => 'success',
                'videos' => $videos,
                'result' => $result,
            ]);
        } else if(sizeof($videos) == 0) {
            return response()->json([
                'code' => 200,
                'status' => 'success',
                'videos' => 0,
                'message' => 0,
            ]);
        } else {
            return response()->json([
                'code' => 404,
                'status' => 'error',
                'message' => 'Videos not found',
            ]);
        }
    }

    // update title of the video
    public function updateTitle($id, Request $request) 
    {
        // get auth from user
        $user = $this->getIdentity($request);
        
        // if the id is not empty
        if(!empty($id)) {
            // create the video
            $video = Video::where('id', $id)
                ->where('user_id', $user->sub)
                ->first();

            // if the video is not empty and is an object
            if(!empty($video) && is_object($video)) {
                $video->accordion_title = null;
                
                // update
                $video->update();
                
                $data = [
                    'code' => 200,
                    'status' =>'success',
                    'video' => $video,
                ];
            } else {
                $data = [
                    'code' => 404,
                    'status' => 'error',
                    'message' => 'Video not found',
                ];
            }
        } else {
            $data = [
                'code' => 404,
              'status' => 'error',
              'message' => 'Video not found',
            ];
        }

        return response()->json($data, $data['code']);
    }

    // upload the image of the course
    public function upload(Request $request) 
    {
        // get the image
        $file = $request->file('file0');

        // validate the file
        $validate = Validator::make($request->all(), [
            'file0' => 'required|file|mimes:txt,docx,doc,pdf,rar'
        ]);

        // save the file
        if (!$file || $validate->fails()) {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Error uploading file'
            ];
        } else {
            $file_name = time() . $file->getClientOriginalName();
            Storage::disk('docs')->put($file_name, File::get($file));

            $data = [
                'code' => 200,
                'status' => 'success',
                'file' => $file_name
            ];
        }

        return response()->json($data, $data['code']);
    }
}
