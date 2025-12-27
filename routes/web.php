<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [BookController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('books', BookController::class);

    // Route::post('/sections', [SectionController::class, 'store']);
    // Route::put('/sections/{section}', [SectionController::class, 'update']);

    Route::post('/books/{book}/collaborators', [BookController::class, 'addCollaborator']);
    Route::delete('/books/{book}/collaborators/{user}', [BookController::class, 'removeCollaborator']);

    Route::get('/books/{book}/sections/create', [SectionController::class, 'create'])
        ->name('sections.create');
    Route::post('/books/{book}/sections', [SectionController::class, 'store'])
        ->name('sections.store');
        
    Route::get('/sections/{section}/edit', [SectionController::class, 'edit'])
        ->name('sections.edit');
    Route::put('/sections/{section}', [SectionController::class, 'update'])
        ->name('sections.update');

    Route::delete('/sections/{section}', [SectionController::class, 'destroy'])
        ->name('sections.destroy');

});

require __DIR__ . '/auth.php';
