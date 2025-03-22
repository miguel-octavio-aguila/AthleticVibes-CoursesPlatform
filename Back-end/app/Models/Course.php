<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    //ORM 
    use HasFactory;
    protected $table = 'courses';

    // updated automatically
    protected $fillable = [
        'category_id',
        'name',
        'detail',
        'image',
        'url',
        'accordion',
        'current_price',
        'previous_price',
        'num_sales',
    ];

    // one to many relationship
    public function videos() {
        return $this->hasMany('App\Models\Video');
    }

    // many to many relationship
    public function users() {
        return $this->belongsToMany('App\Models\User', 'sales');
    }

    //many to one relationship
    public function categories() {
        return $this->belongsTo('App\Models\Category', 'category_id');
    }
}
