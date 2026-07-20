import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        href: string;
        icon?: string;
    };
    className?: string;
}

export function SectionHeader({ title, subtitle, action, className = "" }: SectionHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
            <div className="space-y-1 flex-1">
                <h2 className="text-2xl md:text-3xl font-headline-md font-bold text-slate-900 dark:text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
            
            {action && (
                <Link 
                    href={action.href} 
                    className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-2"
                >
                    {action.label}
                    <Icon 
                        name={action.icon || "arrow_forward"} 
                        className="text-[18px] group-hover:translate-x-1 transition-transform" 
                    />
                </Link>
            )}
        </div>
    );
}
