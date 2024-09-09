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
            'SELECT p.*, COUNT(l.id) as likes, COUNT(c.id) as comments
             FROM podcasts p
             LEFT JOIN likes l ON l.podcast_id = p.id
             LEFT JOIN comments c ON c.podcast_id = p.id
             GROUP BY p.id'
        );

        return response()->json($podcasts, 200);
    }


    public function getPodcastsByCategory($category)
    {
        $podcasts = DB::select(
            'SELECT p.*, COUNT(l.id) as likes, COUNT(c.id) as comments
             FROM podcasts p
             LEFT JOIN likes l ON l.podcast_id = p.id
             LEFT JOIN comments c ON c.podcast_id = p.id
             WHERE p.category = ?
             GROUP BY p.id',
            [$category]
        );

        return response()->json($podcasts, 200);
    }
}
