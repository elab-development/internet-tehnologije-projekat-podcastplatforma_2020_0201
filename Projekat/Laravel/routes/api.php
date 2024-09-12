<?php
use App\Http\Controllers\UserController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::put('/change-password', [UserController::class, 'changePassword']);
Route::get('/trending-podcasts', [PodcastController::class, 'fetchTrendingPodcasts']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/podcasts', [PodcastController::class, 'getAllPodcasts']);
    Route::get('/podcasts/category/{category}', [PodcastController::class, 'getPodcastsByCategory']);
    Route::post('/podcasts/upload', [PodcastController::class, 'uploadPodcast']);
    Route::get('/podcasts/user', [PodcastController::class, 'getUserPodcasts']);

    Route::get('/comments/user', [CommentController::class, 'getUserComments']);
    Route::post('/comment', [CommentController::class, 'addComment']);
    Route::delete('/comments/{id}', [CommentController::class, 'deleteComment']);
    Route::get('/comments/{podcastId}', [CommentController::class, 'getComments']);
    Route::get('/allComments', [CommentController::class, 'getAllComments']);


    Route::get('/likes/user', [UserController::class, 'getUserLikes']);
    Route::post('/like', [CommentController::class, 'likePodcast']);

    Route::get('/admin/approve-users', [UserController::class, 'getUsersToApprove']);
    Route::post('/admin/approve-user/{email}', [UserController::class, 'approveUser']);
    Route::delete('/admin/reject-user/{email}', [UserController::class, 'rejectUser']);

});
