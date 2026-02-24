"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${className}`}
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-600" />
            ) : (
                <Copy className="w-4 h-4 text-gray-500" />
            )}
        </button>
    );
}
