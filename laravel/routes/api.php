<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResponseController;

Route::post('/login', [ResponseController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
Route::post('/product-create', [ResponseController::class, 'productCreate']);
Route::get('/get-product-list', [ResponseController::class, 'getProductList']);
Route::get('/get-product/{id}', [ResponseController::class, 'getProduct']);
Route::post('/product-update', [ResponseController::class, 'productUpdate']);
Route::delete('/product-delete/{id}', [ResponseController::class, 'productDelete']);
Route::post('/logout', [ResponseController::class, 'logout']);
});
