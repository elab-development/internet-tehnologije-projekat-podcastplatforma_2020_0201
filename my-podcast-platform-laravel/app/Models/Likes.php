<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Likes extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'podcast_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function podcast(): BelongsTo
    {
        return $this->belongsTo(Podcast::class);
    }
}
