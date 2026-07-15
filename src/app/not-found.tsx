import Link from 'next/link';
import { Ghost, ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30 blur-3xl rounded-full w-48 h-48 -z-10 animate-pulse"></div>
                <Ghost className="w-32 h-32 text-primary-500 animate-bounce" />
            </div>
            
            <h1 className="text-6xl font-black text-surface-900 dark:text-white mb-4 tracking-tight">404</h1>
            <h2 className="text-3xl font-bold text-surface-800 dark:text-surface-100 mb-6">Page Not Found</h2>
            
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-md mb-10">
                Looks like this deal has expired, or the page you're looking for doesn't exist anymore.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link 
                    href="/" 
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-1"
                >
                    Back to Home
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                    href="/stores" 
                    className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 px-8 py-4 rounded-xl font-bold transition-all hover:shadow-md"
                >
                    <Search className="w-5 h-5" />
                    Browse Stores
                </Link>
            </div>
        </div>
    );
}
