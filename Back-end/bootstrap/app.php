<?php

use App\Http\Middleware\ApiAuthMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Facade;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->validateCsrfTokens(except: [
            'http://backend-rest.com/api/register',
            'http://backend-rest.com/api/login',
            'http://backend-rest.com/api/update',
            'http://backend-rest.com/api/upload',
            'http://backend-rest.com/api/logout',
            'http://backend-rest.com/api/user/avatar/*',
            'http://backend-rest.com/api/user/detail/*',
            'http://backend-rest.com/api/courses',
            'http://backend-rest.com/api/courses/*',
            'http://backend-rest.com/api/courses/getCourse/*',
            'http://backend-rest.com/api/courses/upload',
            'http://backend-rest.com/api/courses/search/*',
            'http://backend-rest.com/api/courses/image/*',
            'http://backend-rest.com/api/courses/getCoursesByCategory/*',
            'http://backend-rest.com/api/videos',
            'http://backend-rest.com/api/videos/*',
            'http://backend-rest.com/api/videos/getVideos',
            'http://backend-rest.com/api/videos/getVideosByCourse/*',
            'http://backend-rest.com/api/videos/getVideosWithProgress/*',
            'http://backend-rest.com/api/videos/updateTitle/*',
            'http://backend-rest.com/api/videos/doc',
            'http://backend-rest.com/api/sales',
            'http://backend-rest.com/api/sales/*',
            'http://backend-rest.com/api/sales/getMyCourses',
            'http://backend-rest.com/api/sales/getSalesByCategory/*',
            'http://backend-rest.com/api/sales/getSalesByText/*',
            'http://backend-rest.com/api/comments',
            'http://backend-rest.com/api/comments/*',
            'http://backend-rest.com/api/comments/upload',
            'http://backend-rest.com/api/comments/image/*',
            'http://backend-rest.com/api/responses',
            'http://backend-rest.com/api/responses/*',
            'http://backend-rest.com/api/reponses/upload',
            'http://backend-rest.com/api/reponses/image/*',
            'http://backend-rest.com/api/checkboxes',
            'http://backend-rest.com/api/checkboxes/*',
            'http://backend-rest.com/api/categories',
            'http://backend-rest.com/api/categories/*',
            'http://backend-rest.com/api/carts',
            'http://backend-rest.com/api/carts/*',
            'http://backend-rest.com/api/carts/deleteCart',
        ]);
        $middleware->alias([
            'api.auth' => ApiAuthMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

/* Class aliases */
Facade::defaultAliases()->merge([
    'JwAuth' => App\Helpers\JwtAuth::class,
])->toArray();