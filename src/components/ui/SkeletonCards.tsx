export function CouponCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col animate-pulse">
            <div className="p-5 flex gap-4 h-full">
                {/* Store Logo Skeleton */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700"></div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        {/* Type Badge & Meta Skeleton */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>

                        {/* Title Skeleton */}
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>

                        {/* Stats Skeleton */}
                        <div className="flex gap-4 mt-auto">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="mt-4 h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export function StoreCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    );
}
