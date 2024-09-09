<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function getUserComments()
    {
        $comments = DB::select('SELECT * FROM comments WHERE user_id = ?', [auth()->id()]);

        return response()->json($comments);
    }

    public function deleteComment($commentId)
    {
        DB::delete('DELETE FROM comments WHERE id = ? AND user_id = ?', [$commentId, auth()->id()]);

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }

    public function addComment(Request $request)
{
    $request->validate([
        'podcast_id' => 'required|integer|exists:podcasts,id',
        'comment' => 'required|string|max:1000',
    ]);

    DB::insert('INSERT INTO comments (user_id, podcast_id, text) VALUES (?, ?, ?)', [
        auth()->id(),
        $request->podcast_id,
        $request->comment,
    ]);

    return response()->json(['message' => 'Comment added successfully'], 201);

}

public function getComments($podcastId, Request $request)
{
    $request->validate([
        'podcast_id' => 'required|integer|exists:podcasts,id',
    ]);

    $comments = DB::select('
        SELECT c.*, u.email
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.podcast_id = ?
    ', [$podcastId]);

    return response()->json($comments);
}

public function likePodcast(Request $request)
{
    $request->validate([
        'podcast_id' => 'required|integer|exists:podcasts,id',
    ]);

    $existingLike = DB::select('SELECT * FROM likes WHERE user_id = ? AND podcast_id = ?', [auth()->id(), $request->podcast_id]);

    if ($existingLike) {
        return response()->json(['message' => 'You have already liked this podcast'], 400);
    }

    DB::insert('INSERT INTO likes (user_id, podcast_id) VALUES (?, ?)', [
        auth()->id(),
        $request->podcast_id,
    ]);

    return response()->json(['message' => 'Podcast liked successfully'], 201);
}


}