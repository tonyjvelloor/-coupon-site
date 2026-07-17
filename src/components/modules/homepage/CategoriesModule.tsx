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
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 transition-colors duration-300">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="font-display-lg text-title-md font-bold text-on-surface dark:text-white">Shop by Category</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant mt-2">Find the best deals across your favorite categories</p>
                </div>
                <Link href="/categories" className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-brand-indigo font-bold transition-colors">
                    View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center gap-3 group category-icon-wrapper">
                        <div className="w-16 h-16 rounded-2xl bg-surface-container dark:bg-inverse-surface border border-surface-variant/30 flex items-center justify-center group-hover:bg-primary-container transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant dark:text-surface-variant group-hover:text-primary transition-colors category-icon" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                {getIconForCategory(cat.slug)}
                            </span>
                        </div>
                        <span className="font-label-md text-label-sm text-center text-on-surface dark:text-white font-bold group-hover:text-primary transition-colors">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
