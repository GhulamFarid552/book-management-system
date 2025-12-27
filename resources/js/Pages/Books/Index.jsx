import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard({ books, flash }) {
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
                            {flash.success && (
                                <div className="mb-4 rounded bg-green-100 px-4 py-2 text-green-800">
                                    {flash.success}
                                </div>
                            )}

                            {/* Create Book */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Books</h3>

                                <Link
                                    href="/books/create"
                                    className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    + Add New Book
                                </Link>
                            </div>

                            {/* Books List */}
                            {books.length === 0 ? (
                                <p>No books found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-4 py-2 text-left">
                                                    #
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Title
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Role
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.map((book, index) => (
                                                <tr
                                                    key={book.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="border px-4 py-2">
                                                        {index + 1}
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        {book.title}
                                                    </td>

                                                    <td className="border px-4 py-2 capitalize">
                                                        {book.pivot?.role}
                                                    </td>

                                                    <td className="border px-4 py-2">
                                                        <div className="flex gap-2">
                                                            {/* Open */}
                                                            <Link
                                                                href={`/books/${book.id}`}
                                                                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                                            >
                                                                Open
                                                            </Link>

                                                            {/* Edit (Author only) */}
                                                            {book.pivot
                                                                ?.role ===
                                                                "author" && (
                                                                <Link
                                                                    href={`/books/${book.id}/edit`}
                                                                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            )}

                                                            {/* Delete (Author only) */}
                                                            {book.pivot
                                                                ?.role ===
                                                                "author" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                "Are you sure?"
                                                                            )
                                                                        ) {
                                                                            Inertia.delete(
                                                                                `/books/${book.id}`
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
