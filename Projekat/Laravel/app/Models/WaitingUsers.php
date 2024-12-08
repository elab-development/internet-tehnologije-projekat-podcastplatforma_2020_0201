<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WaitingUsers extends Model
{
    use HasFactory;

    protected $table = 'users_waiting_approval';

    protected $fillable = ['name', 'email'];

}
