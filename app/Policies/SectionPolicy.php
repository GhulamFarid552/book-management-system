<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\Section;
use App\Models\User;

class SectionPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function create(User $user, Book $book)
    {
        return $user->roleForBook($book->id) === 'author';
    }

    public function update(User $user, Section $section)
    {
        return in_array(
            $user->roleForBook($section->book_id),
            ['author', 'collaborator']
        );
    }

}
