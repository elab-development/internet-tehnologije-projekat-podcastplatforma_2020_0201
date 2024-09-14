<?php
namespace App\Http\Controllers;

use App\Models\Podcast;
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

    public function changePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found', 'code' => 404], 404);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully'], 200);
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

    public function approveUser(Request $request)
    {
        $validatedData = $request->validate(['email' => 'required|email']);

        $waitingUser = DB::select('SELECT * FROM users_waiting_approval WHERE email = ?', [$validatedData['email']]);
        if ($waitingUser) {
            DB::transaction(function () use ($waitingUser) {
                DB::insert('INSERT INTO users (name, email, password,role) VALUES (?, ?, ?,?)', [
                    $waitingUser[0]->name, $waitingUser[0]->email, $waitingUser[0]->password,$waitingUser[0]->role
                ]);
                DB::delete('DELETE FROM users_waiting_approval WHERE email = ?', [$waitingUser[0]->email]);
            });

            return response()->json(['message' => 'User approved successfully'], 200);
        }

        return response()->json(['error' => 'User not found'], 404);
    }

    public function getUserLikes(Request $request)
    {
        $user = Auth::user();

        $likedPodcastIds = $user->likes->pluck('podcast_id');

        $likedPodcasts = Podcast::whereIn('id', $likedPodcastIds)->get(['title']);

        $titles = $likedPodcasts->pluck('title');

        return response()->json(['likes' => $titles]);

    }

    public function getUsersToApprove()
    {
        $users = DB::table('users_waiting_approval')->get();

        return response()->json(['users'=>$users],200);
    }

    public function rejectUser($email)
    {
        DB::delete('DELETE FROM users_waiting_approval WHERE email = ?', [$email]);

        return response()->json(['message' => 'User rejected successfully'], 200);
    }

}
