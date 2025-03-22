<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ResponseController;
use App\Http\Controllers\CheckboxController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return view('welcome');
});

// test routes
Route::get('/test', [UserController::class, 'test']);

// Auth routes
Route::post('/api/login', [UserController::class, 'login']);
Route::post('/api/register', [UserController::class, 'register']);
Route::post('/api/logout', [UserController::class, 'logout']);
Route::put('/api/update', [UserController::class, 'update']);
Route::post('/api/upload', [UserController::class, 'upload'])->middleware('api.auth');
Route::get('/api/user/avatar/{filename}', [UserController::class, 'getImage']);
Route::get('/api/user/detail/{id}', [UserController::class, 'detail']);

// Course routes
Route::resource('/api/courses', CourseController::class);
Route::get('/api/courses/getCourse/{id}', [CourseController::class, 'getCourse']);
Route::post('/api/courses/upload', [CourseController::class, 'upload']);
Route::get('/api/courses/search/{search}', [CourseController::class, 'search']);
Route::get('/api/courses/getCoursesByCategory/{id}', [CourseController::class, 'getCoursesByCategory']);
Route::get('/api/courses/image/{filename}', [CourseController::class, 'getImage']);

// Video routes
Route::get('/api/videos/getVideos', [VideoController::class, 'getVideos']);
Route::get('/api/videos/getVideosByCourse/{id}', [VideoController::class, 'getVideosByCourse']);
Route::get('/api/videos/getVideosWithProgress/{id}', [VideoController::class, 'getVideosWithProgress']);
Route::post('/api/videos/doc', [VideoController::class, 'upload']);
Route::resource('/api/videos', VideoController::class);
Route::put('/api/videos/updateTitle/{id}', [VideoController::class, 'updateTitle']);

// Sale routes
Route::get('/api/sales/getMyCourses', [SaleController::class, 'getMyCourses']);
Route::get('/api/sales/getSalesByCategory/{id}', [SaleController::class, 'getSalesByCategory']);
Route::get('/api/sales/getSalesByText/{text}', [SaleController::class, 'getSalesByText']);
Route::resource('/api/sales', SaleController::class);

// Comment routes
Route::post('/api/comments/upload', [CommentController::class, 'upload']);
Route::get('/api/comments/image/{filename}', [CommentController::class, 'getImage']);
Route::resource('/api/comments', CommentController::class);

// Response routes
Route::post('/api/reponses/upload', [ResponseController::class, 'upload']);
Route::get('/api/reponses/image/{filename}', [ResponseController::class, 'getImage']);
Route::resource('/api/responses', ResponseController::class);

// Checkbox routes
Route::resource('/api/checkboxes', CheckboxController::class);

// Category routes
Route::resource('/api/categories', CategoryController::class);

// Carts routes
Route::delete('/api/carts/deleteCart', [CartController::class, 'deleteCart']);
Route::resource('/api/carts', CartController::class);