"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteCampaignLinkButton({ id, name }: { id: string; name: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete campaign link "${name}"?`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/campaign-links/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to delete link");
                return;
            }

            router.refresh();
        } catch (error) {
            console.error("Error deleting campaign link:", error);
            alert("Failed to delete link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
        >
            <Trash2 className="w-4 h-4 text-red-500" />
        </button>
    );
}
