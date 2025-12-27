<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Section extends Model
{
    use SoftDeletes;
    protected $fillable = ['book_id', 'parent_id', 'title', 'content'];

    public function children()
    {
        return $this->hasMany(Section::class, 'parent_id');
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

}
