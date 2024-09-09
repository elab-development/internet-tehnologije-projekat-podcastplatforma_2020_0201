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

}

}