<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Support\Facades\Validator;
use App\Helpers\JwtAuth;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CartController extends Controller implements HasMiddleware
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
        //get identity of user
        $user = $this->getIdentity($request);
        $total = 0;

        //get the cart of the user
        $carts = Cart::where('user_id', $user->sub)->get();

        // arrays
        $products = [];
        $quantities = [];
        $subTotals = [];
        $courses = [];

        // get info of the cart of the user
        foreach($carts as $cart) {
            // save the course
            array_push($courses, $cart->course);
            // save the quantities
            array_push($quantities, $cart->quantity);
            // savethe course id
            array_push($products, $cart->course->id);
            // get the subtotal
            $subTotal = $cart->course->current_price * $cart->quantity;
            // save the subtotal
            array_push($subTotals, $subTotal);
            // add the subtotal to the total
            $total += $subTotal;
        }

        // get a string of the products
        $product_data = implode('-', $products);

        // create the response
        $data = [
            'status' => 'success',
            'code' => 200,
            'message' => 'Cart info',
            'courses' => $courses,
            'carts' => $carts,
            'cont' => $carts->count(),
            'product_data' => $product_data,
            'quantities' => $quantities,
            'subTotals' => $subTotals,
            'total' => $total
        ];

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
        //get the data
        $json = $request->input('json', null);
        //convert data to array
        $params_array = json_decode($json, true);

        // get the identity of the user
        $user = $this->getIdentity($request);

        // get the product that is in the cart
        $cart = Cart::where('user_id', $user->sub)
            ->where('course_id', $params_array['course_id'])
            ->first();

        // if the course is in the cart
        if ($cart) {
            // message
            $data = [
                'status' =>'error',
                'code' => 400,
                'message' => 'Course already in the cart',
                'data' => [
                    'cart' => $cart
                ]
                ];
        } else {
            // if the data is no empty
            if (!empty($params_array)) {
                // validate the data
                $validate = Validator::make($params_array, [
                    'course_id' =>'required',
                    'quantity' => 'required'
                ]);
                // if the data is not valid
                if ($validate->fails()) {
                    // message
                    $data = [
                        'status' =>'error',
                        'code' => 400,
                        'message' => 'Course not added to the cart',
                    ];
                } else {
                    // save the data
                    $cart = new Cart();
                    $cart->user_id = $user->sub;
                    $cart->course_id = $params_array['course_id'];
                    $cart->quantity = $params_array['quantity'];
                    // save the cart
                    $cart->save();
                    // message
                    $data = [
                        'status' =>'success',
                        'code' => 200,
                        'message' => 'Course added to the cart',
                        'data' => [
                            'cart' => $cart
                        ]
                    ];
                }
            } else {
                // message
                $data = [
                    'status' =>'error',
                    'code' => 400,
                    'message' => 'Course not added to the cart',
                ];
            }
        }

        return response()->json($data, $data['code']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        //get identity of user
        $user = $this->getIdentity($request);

        // cart of the user
        $carts = Cart::all()
            ->where('user_id', $user->sub)
            ->where('course_id', $id);
        
        // if the user has the course in the cart
        foreach ($carts as $cart) {
            // if the course is in the cart
            if ($cart->course_id == $id) {
                return response()->json([
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'Course already in the cart',
                    'data' => [
                        'cart' => $cart
                    ]
                ], 200);
            }
        }

        // is the cart exists
        if($carts) {
            return response()->json([
                'status' =>'success',
                'code' => 200,
                'message' => 'Course added to the cart',
                'data' => [
                    'cart' => $carts
                ]
            ], 200);
        } else {
            return response()->json([
                'status' =>'error',
                'code' => 404,
                'message' => 'Course not found',
                'data' => [
                    'cart' => $carts
                ]
            ], 404);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        //get identity of user
        $user = $this->getIdentity($request);

        // cart of the user
        $cart = Cart::where('user_id', $user->sub)
            ->where('course_id', $id)
            ->first();
        
        // if the cart exists
        if (!empty($cart)) {
            // delete the cart
            $cart->delete();
            // message
            $data = [
                'status' =>'success',
                'code' => 200,
                'message' => 'Course removed from the cart',
                'data' => [
                    'cart' => $cart
                ]
            ];
        } else {
            // message
            $data = [
                'status' =>'error',
                'code' => 404,
                'message' => 'Course not found',
                'data' => [
                    'cart' => $cart
                ]
            ];
        }

        return response()->json($data, $data['code']);
    }

    //delete all the cart
    public function deleteCart(Request $request) 
    {
        //get identity of user
        $user = $this->getIdentity($request);

        // cart of the user
        $cart = Cart::where('user_id', $user->sub)->get();

        // if the cart exists
        if (!empty($cart)) 
        {
            // delete the cart
            // foreach ($carts as $cart) {
            //     $cart->delete();
            // }
            $cart->each->delete();

            // message
            $data = [
                'status' =>'success',
                'code' => 200,
                'message' => 'Cart deleted',
                'data' => [
                    'cart' => $cart
                ]
            ];
        } else {
            // message
            $data = [
                'status' =>'error',
                'code' => 404,
                'message' => 'Cart not found',
                'data' => [
                    'cart' => $cart
                ]
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
