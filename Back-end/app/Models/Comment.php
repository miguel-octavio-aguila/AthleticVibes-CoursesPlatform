<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    //ORM 
    use HasFactory;
    protected $table = 'comments';

    // updated automatically
    protected $fillable = [
        'title',
        'comment',
        'image',
    ];

    // many to one relationship
    public function video() {
        return $this->belongsTo('App\Models\Video', 'video_id');    
    }

    // many to one relationship
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');    
    }

    // one to many relationship
    public function responses() {
        return $this->hasMany('App\Models\Responxe');
    }
}
