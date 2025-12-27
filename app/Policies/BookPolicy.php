<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;

class BookPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    public function manage(User $user, Book $book)
    {
        return $user->roleForBook($book->id) === 'author';
    }

    public function view(User $user, Book $book)
    {
        $role = $user->roleForBook($book->id);
        return in_array($role, ['author', 'collaborator']);
    }

}
