export function CouponCardSkeleton() {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-sm border border-surface-200 dark:border-surface-700 h-full flex flex-col animate-pulse">
            <div className="p-5 flex gap-4 h-full">
                {/* Store Logo Skeleton */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-surface-200 dark:bg-surface-700"></div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        {/* Type Badge & Meta Skeleton */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="h-5 w-16 bg-surface-200 dark:bg-surface-700 rounded-full"></div>
                            <div className="h-4 w-12 bg-surface-200 dark:bg-surface-700 rounded"></div>
                        </div>

                        {/* Title Skeleton */}
                        <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-full mb-2"></div>
                        <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-5/6 mb-4"></div>

                        {/* Stats Skeleton */}
                        <div className="flex gap-4 mt-auto">
                            <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded"></div>
                            <div className="h-4 w-20 bg-surface-200 dark:bg-surface-700 rounded"></div>
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-4 h-10 w-full bg-surface-200 dark:bg-surface-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export function StoreCardSkeleton() {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-[2rem] p-6 border border-surface-200 dark:border-surface-700 h-full flex flex-col items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-surface-200 dark:bg-surface-700 mb-4"></div>
            <div className="h-5 w-24 bg-surface-200 dark:bg-surface-700 rounded mb-2"></div>
            <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded"></div>
        </div>
    );
}

export function MerchantCardSkeleton() {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-xl p-5 border border-surface-200 dark:border-surface-700 h-full flex flex-col animate-pulse shadow-sm">
            {/* Header: Logo and Title */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700 shrink-0"></div>
                
                <div className="flex flex-col justify-center flex-grow gap-2">
                    <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                </div>
            </div>
            
            {/* Core Metrics */}
            <div className="space-y-3 mt-auto mb-4">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-5/6"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mt-3"></div>
            </div>

            {/* View Deals CTA */}
            <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800 flex justify-between">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-24"></div>
            </div>
        </div>
    );
}
