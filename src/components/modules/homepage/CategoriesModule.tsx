import { prisma } from "@/lib/db";
import Link from "next/link";

const getIconForCategory = (slug: string) => {
    switch (slug) {
        case 'electronics': return 'devices';
        case 'fashion': return 'checkroom';
        case 'travel': return 'flight';
        case 'food-dining': return 'restaurant';
        case 'health-beauty': return 'health_and_beauty';
        case 'home-kitchen': return 'chair';
        case 'sports': return 'sports_basketball';
        case 'entertainment': return 'movie';
        default: return 'category';
    }
};

export async function CategoriesModule() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        take: 8,
        orderBy: { displayOrder: "asc" },
    });

    if (!categories.length) return null;

    return (
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 transition-colors duration-300">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-display-lg font-bold text-slate-900 dark:text-white tracking-tight">Explore Categories</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">Find the best deals across your favorite shopping categories.</p>
                </div>
                <Link href="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-indigo hover:text-brand-purple transition-colors">
                    View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative bg-white dark:bg-[#0F172A] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-indigo/30 dark:hover:border-brand-indigo/50 shadow-premium-sm hover:shadow-premium-md transition-all duration-300 active:scale-[0.98] flex flex-col items-start gap-4 overflow-hidden">
                        
                        {/* Subtle Background Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-brand-indigo transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                {getIconForCategory(cat.slug)}
                            </span>
                        </div>
                        
                        <div className="relative z-10">
                            <span className="block text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors mb-1">
                                {cat.name}
                            </span>
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                Explore <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
