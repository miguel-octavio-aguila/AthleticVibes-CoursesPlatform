<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    //ORM
    use HasFactory;
    protected $table = 'categories';

    // updated automatically
    protected $fillable = [
        'name'
    ];

    // one to many relationship
    public function courses(){
        return $this->hasMany('App\Models\Course', 'category_id');
    }
}
