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

}