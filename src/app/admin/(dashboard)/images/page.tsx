import Link from "next/link";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function ImagesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Library</h1>
            <p className="text-gray-600 mb-8">Manage your store logos and banner images.</p>

            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-10 h-10 text-violet-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Image Management</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Currently, images are managed directly during Store creation or via Bulk Upload.
                    A dedicated gallery view is coming soon.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/admin/bulk-upload"
                        className="btn-primary flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Go to Bulk Upload
                    </Link>
                </div>
            </div>
        </div>
    );
}
