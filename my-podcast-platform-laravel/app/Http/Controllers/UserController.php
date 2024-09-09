<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    $user = User::where('email', $credentials['email'])->first();

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    if (!Hash::check($credentials['password'], $user->password)) {
        return response()->json(['error' => 'Invalid password'], 401);
    }

    $token = $user->createToken('authToken')->plainTextToken;

    return response()->json(['token' => $token, 'user' => $user], 200);
}

public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'required|string|in:viewer,administrator,host',
            ]);

            $password = Hash::make($request->password);

            if ($request->role === 'administrator') {
                DB::table('users_waiting_approval')->insert([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => $password,
                    'role' => $request->role,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                return response()->json(['message' => 'Registration successful, awaiting admin approval'], 201);
            } else {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => $password,
                    'role' => $request->role,
                ]);

                $token = $user->createToken('authToken')->plainTextToken;

                return response()->json(['token' => $token, 'user' => $user], 201);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'requestNotValid',
                'message' => $e->errors()
            ], 400);
        }
    }

    public function changePassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'new_password' => 'required|min:8|confirmed',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $user->password = Hash::make($request->new_password);
    $user->save();

    return response()->json(['message' => 'Password changed successfully'], 200);
}

public function getUserLikes(Request $request){
    $user = Auth::user();
    $likes = $user->likes;
    return response()->json($likes);
}


}
