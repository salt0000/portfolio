<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticateController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;

Route::post('/register', RegisterController::class)->name('register');
Route::post('/login', [AuthenticateController::class, 'login'])->name('login');
Route::post('/forgot-password', [PasswordController::class, 'forgot'])->name('password.forgot');
Route::post('/reset-password', [PasswordController::class, 'reset'])->name('password.reset');
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticateController::class, 'logout'])->name('logout');
    Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, 'verify'])->middleware('signed')->name('verification.verify');
    Route::get('/email/verify', [VerifyEmailController::class, 'notice'])->name('verification.notice');
    Route::post('/email/verification-notification', [VerifyEmailController::class, 'send'])->name('verification.send');
});