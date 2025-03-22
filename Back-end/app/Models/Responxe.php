<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Responxe extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'responses';

    //update automatically
    protected $fillable = [
        'response',
        'image',
    ];

    // many to one relationship
    public function comment() {
        return $this->belongsTo('App\Models\Comment', 'comment_id');
    }

    // many to one relationship
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');
    }
}
