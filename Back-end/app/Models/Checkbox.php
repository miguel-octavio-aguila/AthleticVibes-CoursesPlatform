<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Checkbox extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'checkboxes';

    // many to one relationship
    public function course() {
        return $this->belongsTo('App\Models\Course', 'course_id');
    }

    // many to one relationship
    public function user() {
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // many to one relationship
    public function video() {
        return $this->belongsTo('App\Models\Video', 'video_id');
    }
}
