<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sale extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'sales';

    //updated automatically
    protected $fillable = [
        'user_id',
        'course_id',
        'video_id',
        'progress',
    ];

    // many to one relationship
    public function course() {
        return $this->belongsTo('App\Models\Course', 'course_id');
    }

    // many to one relationship
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');
    }
}
