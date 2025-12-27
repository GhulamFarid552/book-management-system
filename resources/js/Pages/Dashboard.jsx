import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ books }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Books
                </h2>
            }
        >
            <Head title="My Books" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Create Book */}
                            <Link
                                href="/books/create"
                                className="mb-4 inline-block text-blue-600 underline"
                            >
                                + Create Book
                            </Link>

                            {/* Books List */}
                            {books.length === 0 ? (
                                <p>No books found.</p>
                            ) : (
                                <ul className="mt-4 space-y-2">
                                    {books.map((book) => (
                                        <li key={book.id}>
                                            <Link
                                                href={`/books/${book.id}`}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                {book.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
