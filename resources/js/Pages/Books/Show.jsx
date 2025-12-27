import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function Show({ book, sections, canManage, allUsers }) {
    const addForm = useForm({
        user_id: "",
    });

    const removeForm = useForm();

    function addCollaborator(e) {
        e.preventDefault();
        addForm.post(`/books/${book.id}/collaborators`, {
            preserveScroll: true,
            onSuccess: () => addForm.reset(),
        });
    }

    function removeCollaborator(userId) {
        if (confirm("Remove this collaborator?")) {
            removeForm.delete(`/books/${book.id}/collaborators/${userId}`, {
                preserveScroll: true,
            });
        }
    }

    function Section({ section, level = 0 }) {
        return (
            <div
                className={`mt-4 border border-gray-200 rounded p-4 relative`}
                style={{ marginLeft: level * 16 }} // Optional: indent for hierarchy
            >
                {/* Section Content */}
                <h4 className="font-medium">{section.title}</h4>
                {section.content && (
                    <p className="mt-1 text-gray-600">{section.content}</p>
                )}

                {/* Edit/Delete Buttons (top-right) */}
                {
                    <div className="absolute top-2 right-2 flex gap-2">
                        <Link
                            href={`/sections/${section.id}/edit`}
                            className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                        >
                            Edit
                        </Link>

                        {canManage && (
                            <button
                                type="button"
                                className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this section?"
                                        )
                                    ) {
                                        Inertia.delete(
                                            `/sections/${section.id}`
                                        );
                                    }
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                }

                {/* Render children recursively */}
                {section.children &&
                    section.children.map((child) => (
                        <Section
                            key={child.id}
                            section={child}
                            level={level + 1}
                        />
                    ))}
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Book Details
                </h2>
            }
        >
            <Head title={book.title} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6 text-gray-900">
                            {/* ===== Collaborators Section (TOP) ===== */}
                            {canManage && (
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Collaborators
                                    </h3>

                                    {/* Add collaborator */}
                                    <form
                                        onSubmit={addCollaborator}
                                        className="flex gap-3 mb-4"
                                    >
                                        <select
                                            value={addForm.data.user_id}
                                            onChange={(e) =>
                                                addForm.setData(
                                                    "user_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        >
                                            <option value="">
                                                Select user
                                            </option>

                                            {allUsers
                                                .filter(
                                                    (u) =>
                                                        !book.users.find(
                                                            (bu) =>
                                                                bu.id === u.id
                                                        )
                                                )
                                                .map((user) => (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name}
                                                    </option>
                                                ))}
                                        </select>

                                        <button
                                            type="submit"
                                            disabled={addForm.processing}
                                            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                        >
                                            Add
                                        </button>
                                    </form>

                                    {/* Existing collaborators */}
                                    <div className="space-y-2">
                                        {book.users
                                            .filter(
                                                (u) =>
                                                    u.pivot.role ===
                                                    "collaborator"
                                            )
                                            .map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between rounded border p-2"
                                                >
                                                    <span>{user.name}</span>

                                                    <button
                                                        onClick={() =>
                                                            removeCollaborator(
                                                                user.id
                                                            )
                                                        }
                                                        className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {canManage && (
                                <div className="flex gap-3">
                                    <Link
                                        href={`/books/${book.id}/sections/create`}
                                        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                    >
                                        + Add Section
                                    </Link>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold">
                                    {book.title}
                                </h3>

                                {sections.length === 0 && (
                                    <p className="mt-2 text-gray-500">
                                        No sections added yet.
                                    </p>
                                )}

                                {sections.map((section) => (
                                    <Section
                                        key={section.id}
                                        section={section}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
