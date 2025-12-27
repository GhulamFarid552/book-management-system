<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Section;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BookController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        return Inertia::render('Books/Index', [
            'books' => auth()->user()->books()->with('users')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Books/Create');
    }

    public function store(Request $request)
    {
        $book = Book::create([
            'title' => $request->title,
            'user_id' => auth()->id()
        ]);

        $book->users()->attach(auth()->id(), ['role' => 'author']);

        // return redirect()->route('books.index', $book);
        return redirect()->route('books.index')
            ->with('success', 'Book added successfully.');
    }

    public function edit($id)
    {
        $book = Book::findOrFail($id);
        $this->authorize('manage', $book);

        return Inertia::render('Books/Edit', [
            'book' => $book
        ]);
    }

    // Update book
    public function update(Request $request, $id)
    {
        // dd($request->all());
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $book = Book::findOrFail($id);
        $this->authorize('manage', $book);

        $book->update([
            'title' => $request->title,
        ]);

        return redirect()->route('books.index')
            ->with('success', 'Book updated successfully.');
    }

    public function destroy($id)
    {
        $book = Book::findOrFail($id);
        $this->authorize('manage', $book);

        // Optional: You can check if the authenticated user is the author
        if (auth()->user()->id !== $book->user_id) {
            return redirect()->route('books.index')
                ->with('error', 'You are not authorized to delete this book.');
        }

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Book deleted successfully.');
    }

    public function show(Book $book)
    {
        $this->authorize('view', $book);
        return Inertia::render('Books/Show', [
            'book' => $book->load('users'),
            'sections' => Section::whereNull('parent_id')
                ->where('book_id', $book->id)
                ->with('children.children')
                ->get(),
            'canManage' => auth()->user()->roleForBook($book->id) === 'author',
            'allUsers' => User::where('id', '!=', auth()->id())->get()
        ]);
    }
    public function addCollaborator(Request $request, Book $book)
    {
        $this->authorize('manage', $book);

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $book->users()->syncWithoutDetaching([
            $request->user_id => ['role' => 'collaborator'],
        ]);

        return back();
    }
    public function removeCollaborator(Book $book, User $user)
    {
        $this->authorize('manage', $book);
        $book->users()->detach($user->id);
        return back();
    }

}
