<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthenticationController;


Route::get('/products', [ProductController::class, 'index']);
Route::post('/login', [AuthenticationController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn () => auth()->user());

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart/{cart}', [CartController::class, 'update']);
    Route::delete('/cart/{cart}', [CartController::class, 'destroy']);


});
