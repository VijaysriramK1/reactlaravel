<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class ResponseController extends Controller
{
    public function productCreate(Request $request)
    {
        $rules = [
            'name' => 'required',
            'years' => 'required',
            'status' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = new Product();

        $product->name = $request->name;
        $product->status = $request->status == true ? 1 : 0;
        $product->years = $request->years;
        $product->save();

        if ($request->hasFile('image')) {
            $latestId = $product->id;
            $image = $request->file('image');
            $imageName = $image->getClientOriginalName();
            $image->move(public_path('assets/images/' . $latestId), $imageName);
            $product->image = 'assets/images/' . $latestId . '/' . $imageName;
            $product->save();
        } else {}
        return response()->json(['message' => 'Product created successfully']);
    }

    public function getProductList()
    {
        $request = request();
        $page = $request->input('page', 1);
        $perPage = 10;
        $skip = ($page - 1) * $perPage;
        $products = Product::skip($skip)->take($perPage)->get();
        $totalProducts = Product::count();
        $totalPages = ceil($totalProducts / $perPage);

        return response()->json([
            'data' => $products->map(function ($product) {
                if (is_null($product->image)) {
                    $product->image = url('assets/images/placeholder/placeholder.png');
                } else {
                    $product->image = url($product->image);
                }
                return $product;
            }),
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_products' => $totalProducts,
        ]);
    }

    public function getProduct($id)
    {
        $product = Product::find($id);
        if ($product) {
            if (is_null($product->image)) {
                $product->image = url('assets/images/placeholder/placeholder.png');
                $product->image_name = '';
            } else {
                $product->image = url($product->image);
                $product->image_name = basename($product->image);
            }
            return response()->json($product);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function productUpdate(Request $request)
    {
        $rules = [
            'name' => 'required',
            'years' => 'required',
            'status' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::find($request->id);
        if ($product) {
            $product->name = $request->name;
            $product->status = $request->status == true ? 1 : 0;
            $product->years = $request->years;

            if ($request->hasFile('image')) {
                if ($product->image && file_exists(public_path($product->image))) {
                    unlink(public_path($product->image));
                }
                $image = $request->file('image');
                $imageName = $image->getClientOriginalName();
                $image->move(public_path('assets/images/' . $product->id), $imageName);
                $product->image = 'assets/images/' . $product->id . '/' . $imageName;
            } else {}

            $product->save();
            return response()->json(['message' => 'Product updated successfully']);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function productDelete($id)
    {
        $product = Product::find($id);
        if ($product->image && file_exists(public_path($product->image))) {
            unlink(public_path($product->image));
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function login(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'password' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                if ($user->email_verified_at == null) {
                    return response()->json(['message' => 'Email not verified'], 403);
                }

                $user->tokens()->delete();
                $token = $user->createToken('Personal Access Token')->plainTextToken;
                return response()->json(['token' => $token]);
            } else {
                return response()->json(['message' => 'Invalid credentials'], 404);
            }
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            $personalAccessToken = PersonalAccessToken::findToken($token);
            if ($personalAccessToken) {
                $personalAccessToken->delete();
            }
        }
        return response()->json(['message' => 'Logged out successfully']);
    }
}
