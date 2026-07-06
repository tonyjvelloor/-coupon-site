import { CouponCardSkeleton, StoreCardSkeleton } from "@/components/ui/SkeletonCards";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            {/* Hero Placeholder */}
            <section className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 pt-16 pb-20 md:pt-20 md:pb-28 px-4 animate-pulse">
                <div className="container mx-auto max-w-7xl relative z-10 space-y-8 lg:space-y-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
                        {/* Left Column Skeleton */}
                        <div className="flex-1 space-y-6 lg:max-w-xl xl:max-w-2xl w-full">
                            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto lg:mx-0"></div>
                            <div className="h-16 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-xl mx-auto lg:mx-0"></div>
                            <div className="h-24 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 flex justify-center mt-8 lg:mt-0">
                            <div className="w-full aspect-square max-w-[400px] bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Placeholders */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
                {/* Row 1 Placeholders */}
                <div>
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-40"><StoreCardSkeleton /></div>
                        ))}
                    </div>
                </div>

                {/* Row 2 Placeholders */}
                <div>
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[250px]"><CouponCardSkeleton /></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
