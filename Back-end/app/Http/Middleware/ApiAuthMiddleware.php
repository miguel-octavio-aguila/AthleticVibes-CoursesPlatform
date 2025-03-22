<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Helpers\JwtAuth;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if the user is authenticated
        $token = $request->header('Authorization');
        $jwtAuth = new JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        // if the token is valid
        if ($checkToken) {
            return $next($request);
        } else {
            // if the token is not valid
            $data = [
                'status' => 'error',
                'code' => 401,
                'message' => 'User not authenticated'
            ];

            return response()->json($data, $data['code']);
        }
    }
}
