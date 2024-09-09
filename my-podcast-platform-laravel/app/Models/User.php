<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password', 'remember_token'];

    public function podcasts(): HasMany
    {
        return $this->hasMany(Podcast::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Likes::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comments::class);
    }

}
