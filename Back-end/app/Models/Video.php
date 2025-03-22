<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Video extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'videos';

    // updates automatically
    protected $fillable = [
        'title',
        'content',
        'url',
        'file',
        'download',
        'section',
        'accordion_title',
    ];

    // many to one relationship
    public function course()
    {
        return $this->belongsTo('App\Models\Course', 'course_id');
    }

    // one to many relationship
    public function comments()
    {
        return $this->hasMany('App\Models\Comment')->orderBy('id', 'desc');
    }

    // many to one relationship
    public function user()
    {
        return $this->belongsTo('App\Models\User', 'user_id');
    }
}
