<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CategoryController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('api.auth', except: ['index', 'show']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //get all categories
        $categories = Category::all();

        // if the categories are not empty
        if (is_object($categories)) {
            // return the categories
            $data = [
                'status' => 'success',
                'code' => 200,
                'categories' => $categories,
            ];
        } else {
            // return an error
            $data = [
                'status' => 'error',
                'code' => 404,
               'message' => 'Categories not found',
            ];
        }

        // return the data
        return response()->json($data, $data['code']);
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
        //recieve the data from POST
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the data is not empty
        if (!empty($params_array)) {
            //validate the data
            $validate = Validator::make($params_array, [
                'name' => 'required',
            ]);

            // if the data is valid
            if ($validate->fails()) {
                // return an error
                $data = [
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Category not created',
                ];
            } else {
                // create the category
                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();
                // return a success
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Category created',
                    'category' => $category,
                ];
            }
        } else {
            // return an error
            $data = [
               'status' => 'error',
                'code' => 400,
               'message' => 'Invalid data',
            ];
        }

        // return the data
        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //get category
        $category = Category::find($id);

        // if the category is an object
        if (is_object($category)) {
            // return the category
            $data = [
               'status' =>'success',
                'code' => 200,
                'category' => $category,
            ];
        } else {
            // return an error
            $data = [
               'status' => 'error',
                'code' => 404,
              'message' => 'Category not found',
            ];
        }

        // return the data
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
        //recieve de data 
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        // if the data is not empty
        if (!empty($params_array)) {
            //validate the data
            $validate = Validator::make($params_array, [
                'name' =>'required',
            ]);

            // if the data is valid
            if ($validate->fails()) {
                // return an error
                $data = [
                  'status' => 'error',
                    'code' => 400,
                   'message' => 'Category not updated',
                ];
            } else {
                // update the category
                unset($params_array['id']);
                unset($params_array['created_at']);
                $category = Category::where('id', $id)->first();

                // if category is not empty and is an object
                if (!empty($category) && is_object($category)) {
                    // update the category
                    $category->update($params_array);
                    // return a success
                    $data = [
                     'status' =>'success',
                        'code' => 200,
                       'message' => 'Category updated',
                        'category' => $category,
                    ];
                } else {
                    // return an error
                    $data = [
                      'status' => 'error',
                        'code' => 404,
                      'message' => 'Category not found',
                    ];
                }
            }
        } else {
            // return an error
            $data = [
              'status' => 'error',
                'code' => 400,
             'message' => 'Invalid data',
            ];
        }

        // return the data
        return response()->json($data, $data['code']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // get the category
        $category = Category::where('id', $id)->first();

        // if the category is not empty and is an object
        if (!empty($category) && is_object($category)) {
            // delete the category
            $category->delete();
            // return a success
            $data = [
            'status' =>'success',
                'code' => 200,
              'message' => 'Category deleted',
            ];
        } else {
            // return an error
            $data = [
            'status' => 'error',
                'code' => 404,
             'message' => 'Category not found',
            ];
        }

        // return the data
        return response()->json($data, $data['code']);
    }
}
