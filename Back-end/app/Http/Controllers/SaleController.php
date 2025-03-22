<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Helpers\JwtAuth;
use App\Models\Course;
use App\Models\Cart;
use App\Models\Video;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class SaleController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: []),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //get the identity of the user
        $user = $this->getIdentity($request);

        //get the sales of the user
        $sales = Sale::where('user_id', $user->sub)->get();

        // get all the courses
        $courses = Course::all();

        // get the cart of the user
        $cart = Cart::where('user_id', $user->sub)->get();

        // course status
        $courseStatus = [];
        // check if the course is in the cart
        foreach ($courses as $course) {
            foreach ($sales as $sale) {
                if ($sale->course_id == $course->id) {
                    // add new propertie buy to the course
                    $course->buy = 1;
                    // add new propertie video to the course
                    $course->video = $sale->video_id;
                }
            }
            foreach($cart as $cartItem) {
                if ($cartItem->course_id == $course->id && $cartItem->quantity == 1) {
                    // add new propertie cartItem to the course
                    $course->cartItem = 1;
                }
            }
            // add the course to the array
            array_push($courseStatus, $course);
        }

        // return the sales
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'sales' => $sales,
            'courseStatus' => $courseStatus
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
        //get de user 
        $user = $this->getIdentity($request);

        // get cart
        $cart = Cart::where('user_id', $user->sub)->get();

        // if the cart exists
        if (!empty($cart)) {
            // save the course
            foreach ($cart as $cartItem) {
                // get de videos of the course 
                $video = Video::where('course_id', $cartItem->course_id)->get();
                // if there is a video
                if (!empty($video[0]->id)) {
                    // create the sale
                    $sale = new Sale();
                    $sale->user_id = $cartItem->user_id;
                    $sale->course_id = $cartItem->course_id;
                    $sale->video_id = $video[0]->id;
                    $sale->save();

                    $data = [
                        'code' => 200,
                        'status' => 'success',
                        'message' => 'Sale created successfully',
                        'cart' => $cart
                    ];
                } else {
                    $data = [
                        'code' => 400,
                       'status' =>'error',
                       'message' => 'There is no video for this course'
                    ];
                }
            }
        } else {
            $data = [
                'code' => 400,
               'status' =>'error',
               'message' => 'There is no course in the cart'
            ];
        }

        // return the response
        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        // get the user identity
        $user = $this->getIdentity($request);

        // get the sale
        $sale = Sale::where('user_id', $user->sub)->where('course_id', $id)->first();

        // if a sale exists
        if (!empty($sale)) {
            return response()->json([
                'code' => 200,
               'status' =>'success',
               'sale' => $sale
            ]);
        } else {
            return response()->json([
                'code' => 400,
               'status' =>'error',
               'message' => 'Sale not found'
            ]);
        }
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
                'video_id' => 'required',
                'progress' => 'required',
            ]);

            // if the data fails
            if ($validate->fails()) {
                return response()->json($validate->errors(), 400);
            } else {
                // remove the data that we don't want to update
                unset($params_array['user_id']);
                unset($params_array['created_at']);
                unset($params_array['user']);

                // get identity of the user
                $user = $this->getIdentity($request);

                // update the data
                $sale = Sale::where('id', $id)->first();

                // if the video exists and is an object
                if (!empty($sale) && is_object($sale)) {
                    $sale->update($params_array);

                    $data = [
                        'code' => 200,
                        'status' => 'success',
                        'sale' => $sale,
                        'user' => $user,
                        'changes' => $params_array,
                    ];
                } else {
                    $data = [
                        'code' => 404,
                        'status' => 'error',
                        'message' => 'Sale not found',
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
    public function destroy(string $id)
    {
        //
    }

    // get my courses
    public function getMyCourses(Request $request) 
    {
        // get the user identity
        $user = $this->getIdentity($request);
        // get the sales
        $sales = Sale::where('user_id', $user->sub)->get();
        // get the courses
        $courses = Course::all();
        // get the videos
        $videos = Video::all();
        // get the cart of the user
        $cart = Cart::where('user_id', $user->sub)->get();

        // course status and videos
        $courseStatus = [];
        $videosVector = [];

        // check if the course is in the cart
        foreach ($courses as $course) {
            foreach ($sales as $sale) {
                if ($sale->course_id == $course->id) {
                    // add new propertie buy to the course
                    $course->buy = 1;
                    // add new propertie video to the course
                    $course->video = $sale->video_id;
                }
            }
            foreach($cart as $cartItem) {
                if ($cartItem->course_id == $course->id && $cartItem->quantity == 1) {
                    // add new propertie cartItem to the course
                    $course->cartItem = 1;
                }
            }
            foreach($videos as $video) {
                if ($video->course_id == $course->id && $course->buy == 1) {
                    array_push($videosVector, $video);
                }
            }
            if ($course->buy == 1) {
                // add the course to the array
                array_push($courseStatus, $course);
            }
        }

        // return the sales
        return response()->json([
            'code' => 200,
           'status' =>'success',
           'sales' => $sales,
           'courses' => $courseStatus,
            'videos' => $videosVector
        ]);
    }

    // get sales by category
    public function getSalesByCategory($id, request $request) 
    {
        //get the identity of the user
        $user = $this->getIdentity($request);

        //get the sales of the user
        $sales = Sale::where('user_id', $user->sub)->get();

        // get all the courses
        $courses = Course::where('category_id', $id)->get();

        // get the cart of the user
        $cart = Cart::where('user_id', $user->sub)->get();

        // course status
        $courseStatus = [];
        // check if the course is in the cart
        foreach ($courses as $course) {
            foreach ($sales as $sale) {
                if ($sale->course_id == $course->id) {
                    // add new propertie buy to the course
                    $course->buy = 1;
                    // add new propertie video to the course
                    $course->video = $sale->video_id;
                }
            }
            foreach($cart as $cartItem) {
                if ($cartItem->course_id == $course->id && $cartItem->quantity == 1) {
                    // add new propertie cartItem to the course
                    $course->cartItem = 1;
                }
            }
            // add the course to the array
            array_push($courseStatus, $course);
        }

        // return the sales
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'sales' => $sales,
            'courseStatus' => $courseStatus
        ]);
    }

    // get sales by category
    public function getSalesByText(string $text, request $request) 
    {
        //get the identity of the user
        $user = $this->getIdentity($request);

        //get the sales of the user
        $sales = Sale::where('user_id', $user->sub)->get();

        // get all the courses
        $courses = Course::where('name', 'LIKE', '%'.$text.'%')
            ->orderby('id', 'desc')
            ->get();

        // get the cart of the user
        $cart = Cart::where('user_id', $user->sub)->get();

        // course status
        $courseStatus = [];
        // check if the course is in the cart
        foreach ($courses as $course) {
            foreach ($sales as $sale) {
                if ($sale->course_id == $course->id) {
                    // add new propertie buy to the course
                    $course->buy = 1;
                    // add new propertie video to the course
                    $course->video = $sale->video_id;
                }
            }
            foreach($cart as $cartItem) {
                if ($cartItem->course_id == $course->id && $cartItem->quantity == 1) {
                    // add new propertie cartItem to the course
                    $course->cartItem = 1;
                }
            }
            // add the course to the array
            array_push($courseStatus, $course);
        }

        // return the sales
        return response()->json([
            'code' => 200,
            'status' => 'success',
            'sales' => $sales,
            'courseStatus' => $courseStatus
        ]);
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
