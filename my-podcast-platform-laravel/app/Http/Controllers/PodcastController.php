<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Podcast;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class PodcastController extends Controller
{
    public function getAllPodcasts()
    {
        $podcasts = DB::select(
            'SELECT p.id,p.user_id,p.title,p.description, COUNT(l.id) as likes, COUNT(c.id) as comments
             FROM podcasts p
             LEFT JOIN likes l ON l.podcast_id = p.id
             LEFT JOIN comments c ON c.podcast_id = p.id
             GROUP BY p.id, p.user_id, p.title, p.description' 
        );

        return response()->json($podcasts, 200);
    }


    public function getPodcastsByCategory($category)
    {
        $podcasts = DB::select(
            'SELECT p.id,p.user_id,p.title,p.description, COUNT(l.id) as likes, COUNT(c.id) as comments
             FROM podcasts p
             LEFT JOIN likes l ON l.podcast_id = p.id
             LEFT JOIN comments c ON c.podcast_id = p.id
             WHERE p.category = ?
             GROUP BY p.id,p.user_id,p.title,p.description',
            [$category]
        );

        return response()->json($podcasts, 200);
    }


    public function uploadPodcast(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'video' => 'required|file|mimes:mp4,mkv,avi',
        'category' => 'required|string|max:255',
        'email' => 'required|email',
    ]);

    $email = $request->input('email');

    $user = User::where('email', $email)->first();

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $path = $request->file('video')->store('videos', 'public');

    DB::table('podcasts')->insert([
        'user_id' => $user->id,
        'title' => $request->title,
        'video_url' => $path,
        'category' => $request->category,
    ]);

    return response()->json(['message' => 'Podcast uploaded successfully'], 201);
}


    public function getUserPodcasts()
    {
        $podcasts = DB::select('
            SELECT p.*,
                (SELECT COUNT(*) FROM likes WHERE podcast_id = p.id) AS likes,
                (SELECT COUNT(*) FROM comments WHERE podcast_id = p.id) AS comments
            FROM podcasts p WHERE p.user_id = ?
        ', [auth()->id()]);

        return response()->json($podcasts);
    }

    public function fetchTrendingPodcasts(Request $request)
    {
        $apiUrl = 'https://itunes.apple.com/search';
        $term = $request->input('term', 'trending');

        $response = Http::get($apiUrl, [
            'term' => $term,
            'entity' => 'podcast',
            'limit' => 10,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $podcasts = $data['results'];

            $processedPodcasts = array_map(function ($podcast) {
                return [
                    'collectionName' => $podcast['collectionName'],
                    'collectionId' => $podcast['collectionId'],
                    'artistName' => $podcast['artistName'],
                    'feedUrl' => $podcast['feedUrl'] ?? null,
                    'artworkUrl100' => $podcast['artworkUrl100'] ?? null
                ];
            }, $podcasts);

            return response()->json($processedPodcasts);
        } else {
            return response()->json(['error' => 'Failed to fetch data'], $response->status());
        }
    }
}
