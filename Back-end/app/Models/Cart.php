<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'carts';

    // Updated automatically
    protected $fillable = [
        'quantity'
    ];

    // many to one relationship
    public function user(){
        return $this->belongsTo('App\Models\User', 'user_id');
    }

    // many to one
    public function course(){
        return $this->belongsTo('App\Models\Course', 'course_id');
    }
}
