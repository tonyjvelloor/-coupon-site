import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    name: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
                    <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 shrink-0 flex items-center">
                        <Home className="w-4 h-4" />
                    </Link>
                    
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 shrink-0">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {item.href ? (
                                <Link 
                                    href={item.href} 
                                    className="text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="text-gray-900 dark:text-gray-100 font-medium">
                                    {item.name}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
