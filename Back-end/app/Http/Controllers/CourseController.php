<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use App\Models\Sale;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\Response;

class CourseController extends Controller implements HasMiddleware
{

    // public function __construct()
    // {
    //     $this->middleware('api.auth')->except(['index', 'show', 'search']);
    // }
    
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: ['index', 'search', 'getCourse', 'getCoursesByCategory', 'getImage']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::all();
        return response()->json([
            'code' => 200,
            'message' => 'Success',
            'data' => $courses
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
        //recive de data from POST
        $json = $request->input('json', null);
        $params = json_decode($json); //object
        $params_array = json_decode($json, true); //array

        // check if the data is not empty
        if (!empty($params_array)) {
            // validate the data
            $validate = Validator::make($params_array, [
                'name' => [
                    'required',
                    'regex:/^[\p{L}\p{N}\s\-]+$/u',
                    'unique:courses,name'
                ],
                'category_id' => 'required',
                'image' => 'required',
                'detail' => 'required',
                'url' => 'required',
                'accordion' => 'required',
                'current_price' => 'required',
                'previous_price' => 'required'
            ]);
            
            // if the validation fails
            if ($validate->fails()) {
                return $params_array;
                return response()->json($validate->errors(), 400);
            }

            // save the course
            $course = new Course();
            $course->name = $params_array['name'];
            $course->category_id = $params_array['category_id'];
            $course->image = $params_array['image'];
            $course->detail = $params_array['detail'];
            $course->url = $params_array['url'];
            $course->accordion = $params_array['accordion'];
            $course->current_price = $params_array['current_price'];
            $course->previous_price = $params_array['previous_price'];
            //$course->num_sales = 0;
            $course->save();

            $data = [
                'code' => 200,
                'status' => 'success',
                'course' => $course
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Data is empty'
            ];
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        // get the course
        $course = Course::find($id);
        // get the identity of the user
        $user = $this->getIdentity($request);
        
        
        // check if the user buy the course
        $sales = Sale::where('user_id', $user->sub)
            ->where('course_id', $course->id)
            ->first();

        if (!empty($sales) && is_object($sales)) {
            $course->buy = 1;
        }

        // return the course if it is an object
        if (is_object($course)) {
            // save the number of accordion
            $vector = [];
            array_push($vector, $course->accordion);

            $data = [
                'code' => 200,
                'status' => 'success',
                'accordion' => $vector,
                'course' => $course,
                'sales' => $sales
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Course does not exist'
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
        // recive the data from POST
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the data is not empty
        if (!empty($params_array)) {
            // validate the data
            $validate = Validator::make($params_array, [
                'name' => 'required',
                'category_id' => 'required',
                'detail' => 'required',
                'url' => 'required',
                'accordion' => 'required',
                'current_price' => 'required',
                'previous_price' => 'required'
            ]);

            // if the validation fails
            if ($validate->fails()) {
                return response()->json($validate->errors(), 400);
            }

            // remove the data that is not needed
            unset($params_array['id']);
            unset($params_array['created_at']);
            unset($params_array['user']);
            
            // get the identity of the user
            //$user = $this->getIdentity($request);

            // update the course
            $course = Course::where('id', $id)->first();

            // check if the course exists
            if (!empty($course) && is_object($course)) {
                // update the course
                $course->update($params_array);

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'course' => $course,
                    'changes' => $params_array
                ];
            } else {
                $data = [
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'Course does not exist'
                ];
            }
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Data is empty'
            ];
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $course = Course::where('id', $id)->first();

        // check if the course exists
        if (!empty($course) && is_object($course)) {
            // delete the course
            $course->delete();

            $data = [
                'code' => 200,
                'status' => 'success',
                'course' => $course
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Course does not exist'
            ];
        }

        return response()->json($data, $data['code']);
    }

    // show if the user buy or not the course
    public function getCourse($id) 
    {
        $course = Course::find($id);
        
        // return the course if it is an object
        if (is_object($course)) {
            $vector = [];
            array_push($vector, $course->accordion);


            $data = [
                'code' => 200,
                'status' => 'success',
                'accordion' => $vector,
                'course' => $course
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Course does not exist'
            ];
        }

        return response()->json($data, $data['code']);
    }

    // upload the image of the course
    public function upload(Request $request) 
    {
        // get the image
        $image = $request->file('file0');

        // validate the image
        $validate = Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        // save the image
        if (!$image || $validate->fails()) {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Error uploading image'
            ];
        } else {
            $image_name = time() . $image->getClientOriginalName();
            Storage::disk('images')->put($image_name, File::get($image));

            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $image_name
            ];
        }

        return response()->json($data, $data['code']);
    }

    // get image
    public function getImage($filename) 
    {
        // check if the image exists
        $isset = Storage::disk('images')->exists($filename);

        if ($isset) {
            $file = Storage::disk('images')->get($filename);
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

    // search the course
    public function search($search) 
    {
        $courses = Course::where('name', 'LIKE', "%".$search."%")
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'courses' => $courses
        ]);
    }

    // get courses by category
    public function getCoursesByCategory($id) 
    {
        $courses = Course::where('category_id', $id)
            ->orderBy('id', 'desc')
            ->get();
        
        // if courses is not empty and is an object
        if (!empty($courses) && is_object($courses)) {
            $data = [
                'code' => 200,
                'status' =>'success',
                'courses' => $courses
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Courses does not exist'
            ];
        }

        // return the response
        return response()->json($data, $data['code']);
    }
}
