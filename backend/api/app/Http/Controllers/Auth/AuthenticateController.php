<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticateController extends Controller
{
    /**
     * 認証の試行を処理
     */
    public function login(Request $request): Response
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->noContent();
        }

        return response()->json([
            'message' => 'Incorrect email or password.'
        ], 422);
    }

    /**
     * 認証の試行を処理
     */
    public function logout(Request $request): Response
    {
        Auth::logout();

        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return response()->noContent();
    }    
}