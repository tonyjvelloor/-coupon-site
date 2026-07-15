"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 blur-3xl rounded-full w-48 h-48 -z-10 animate-pulse"></div>
                <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center rotate-12 shadow-lg mx-auto">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
            </div>
            
            <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">Something went wrong!</h1>
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-md mb-10">
                We've encountered an unexpected error. Our team has been notified and is looking into it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <button
                    onClick={() => reset()}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-1"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Try again
                </button>
                <Link
                    href="/"
                    className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 px-8 py-4 rounded-xl font-bold transition-all hover:shadow-md"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Go Home
                </Link>
            </div>
        </div>
    );
}
