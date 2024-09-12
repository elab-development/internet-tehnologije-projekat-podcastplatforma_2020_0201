<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function getUserComments()
    {
        $comments = DB::select('SELECT c.text, p.title as podcast_title
         FROM comments c
         JOIN podcasts p ON c.podcast_id = p.id
         WHERE c.user_id = ?', [auth()->id()]);

        $formattedComments = array_map(function($comment) {
            return [
                'title' => $comment->podcast_title,
                'comment' => $comment->text
            ];
        }, $comments);

        return response()->json(['comments' => $formattedComments]);
    }

    public function deleteComment($commentId)
    {
        DB::delete('DELETE FROM comments WHERE id = ?', [$commentId]);

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
        return response()->json(['message' => 'You have already liked this podcast', 'code' => 400], 400);
    }

    DB::insert('INSERT INTO likes (user_id, podcast_id) VALUES (?, ?)', [
        auth()->id(),
        $request->podcast_id,
    ]);

    return response()->json(['message' => 'Podcast liked successfully', 'code' => 201], 201);
}

public function getAllComments()
{
    $comments = DB::select('
        SELECT c.*, p.title as podcast_title, u.email as user_email, u.name as user_name
        FROM comments c
        JOIN podcasts p ON c.podcast_id = p.id
        JOIN users u ON c.user_id = u.id
    ');

    return response()->json(['comments' => $comments],200);
}


}
