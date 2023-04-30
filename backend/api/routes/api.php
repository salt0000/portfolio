<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('events', [EventController::class, 'index'])->name('event.index');
Route::get('events/{event}', [EventController::class, 'show'])->name('event.show');

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('', [UserController::class, 'show'])->name('user.show');
        Route::patch('', [UserController::class, 'update'])->name('user.update');
        Route::delete('', [UserController::class, 'destroy'])->name('user.destroy');
    });
    Route::post('events', [EventController::class, 'store'])->name('event.store');
    Route::patch('events/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->name('event.destroy');
});