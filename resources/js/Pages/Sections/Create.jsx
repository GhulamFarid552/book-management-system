import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ book, sections }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        parent_id: "",
    });

    function submit(e) {
        e.preventDefault();
        post(`/books/${book.id}/sections`);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Add Section – {book.title}
                </h2>
            }
        >
            <Head title="Add Section" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* ✅ FORM WAS MISSING */}
                            <form onSubmit={submit} className="space-y-4">
                                {/* Parent Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Parent Section (optional)
                                    </label>
                                    <select
                                        value={data.parent_id}
                                        onChange={(e) =>
                                            setData("parent_id", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded border-gray-300"
                                    >
                                        <option value="">None</option>
                                        {sections.map((section) => (
                                            <option
                                                key={section.id}
                                                value={section.id}
                                            >
                                                {section.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded border-gray-300"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content
                                    </label>
                                    <textarea
                                        rows="5"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
                                        }
                                        className="mt-1 block w-full rounded border-gray-300"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                    >
                                        Save
                                    </button>

                                    <Link
                                        href={`/books/${book.id}`}
                                        className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                            {/* ✅ END FORM */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
