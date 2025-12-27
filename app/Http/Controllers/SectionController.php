<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SectionController extends Controller
{
    use AuthorizesRequests;
    public function create(Book $book)
    {
        $this->authorize('create', [Section::class, $book]);

        return Inertia::render('Sections/Create', [
            'book' => $book,
            'sections' => Section::where('book_id', $book->id)
                ->get(),
        ]);
    }

    public function store(Request $request, Book $book)
    {
        $this->authorize('create', [Section::class, $book]);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'parent_id' => 'nullable|exists:sections,id',
        ]);

        Section::create([
            'book_id' => $book->id,
            'parent_id' => $data['parent_id'] ?? null,
            'title' => $data['title'],
            'content' => $data['content'] ?? null,
        ]);

        return redirect()
            ->route('books.show', $book)
            ->with('success', 'Section added successfully.');
    }

    public function edit(Section $section)
    {
        $book = $section->book;
        $this->authorize('update', $section);
        // Load top-level sections for parent dropdown
        $sections = Section::where('book_id', $book->id)
            ->where('id', '!=', $section->id) // cannot be its own parent
            // ->whereNull('parent_id')
            ->get();

        return Inertia::render('Sections/Edit', [
            'section' => $section,
            'book' => $book,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, Section $section)
    {
        $this->authorize('update', $section);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'parent_id' => 'nullable|exists:sections,id',
        ]);

        $section->update([
            'title' => $data['title'],
            'content' => $data['content'] ?? null,
            'parent_id' => $data['parent_id'] ?? null,
        ]);

        return redirect()
            ->route('books.show', $section->book)
            ->with('success', 'Section updated successfully.');
    }

    // Delete section
    public function destroy(Section $section)
    {
        $book = $section->book;
        $this->authorize('create', [Section::class, $book]);
        // dd($book->id);
        $section->delete();

        return redirect()
            ->route('books.show', ['book' => $book->id])
            ->with('success', 'Section deleted successfully.');
    }
}

