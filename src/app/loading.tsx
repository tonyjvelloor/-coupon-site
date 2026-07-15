import { Icon } from "@/components/ui/Icon";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-surface-950/80 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-surface-900 shadow-xl border border-surface-200 dark:border-surface-800 rounded-2xl p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-full border-4 border-surface-100 dark:border-surface-800 border-t-primary-500 animate-spin"></div>
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300 font-bold tracking-wide text-sm uppercase">
                    <Icon name="search" className="text-primary-500 animate-pulse" />
                    Finding Deals...
                </div>
            </div>
        </div>
    );
}
