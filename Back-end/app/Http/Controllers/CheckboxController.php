<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Checkbox;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CheckboxController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: ['']),
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
        //get the data from POST
        $json = $request->input('json', null);
        //convert the data to an array
        $params_array = json_decode($json, true);

        // if the array is not empty
        if (!empty($params_array)) {
            // get the identity of the user
            $user = $this->getIdentity($request);

            //validate the data
            $validate = Validator::make($params_array, [
                'course_id' => 'required',
                'video_id' => 'required',
                'checkbox' =>'required'
            ]);

            //if it fails
            if ($validate->fails()) {
                $data = [
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'The data is not valid'
                ];
            } else {
                //if it passes
                //create the checkbox
                $checkbox = new Checkbox();
                $checkbox->user_id = $user->sub;
                $checkbox->course_id = $params_array['course_id'];
                $checkbox->video_id = $params_array['video_id'];
                $checkbox->checkbox = $params_array['checkbox'];
                //save the checkbox
                $checkbox->save();
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'checkbox' => $checkbox
                ];
            }
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'The data is not valid'
            ];
        }

        //return the data
        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, request $request)
    {
        //get the identity of the user
        $user = $this->getIdentity($request);

        //get the checkbox
        $checkbox = Checkbox::where('user_id', $user->sub)
            ->where('course_id', $id)
            ->get();

        //return the checkbox
        return response()->json([
            'status' => 'success',
            'code' => 200,
            'checkbox' => $checkbox
        ], 200);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        //get the identity of the user
        $user = $this->getIdentity($request);

        //get the checkbox
        $checkbox = Checkbox::where('user_id', $user->sub)
            ->where('id', $id)
            ->first();

        //if it exists
        if (!empty($checkbox)) {
            //delete the checkbox
            $checkbox->delete();
            //return the checkbox
            $data = [
                'status' =>'success',
                'code' => 200,
                'message' => 'Checkbox deleted',
                'checkbox' => $checkbox
            ];
        } else {
            $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'Checkbox not found'
            ];
        }

        //return the data
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
