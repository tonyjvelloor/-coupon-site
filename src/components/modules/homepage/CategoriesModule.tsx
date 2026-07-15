import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function CategoriesModule() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        take: 8,
        orderBy: { displayOrder: "asc" },
    });

    if (!categories.length) return null;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-container-max mx-auto bg-white dark:bg-black">
            <SectionHeader 
                title="Browse by Category" 
                action={{ label: "View all categories", href: "/categories" }} 
            />
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible gap-4 md:pb-0">
                {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center group shrink-0 snap-start w-[100px] sm:w-[120px] md:w-auto">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 relative mb-4 rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm group-hover:shadow-md group-hover:border-primary-500 group-hover:-translate-y-1 transition-all duration-300 bg-surface-100 dark:bg-surface-800">
                            <Image 
                                src={`/images/categories/${cat.slug}.jpg`} 
                                alt={cat.name} 
                                fill 
                                sizes="(max-width: 768px) 80px, 96px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                loading="lazy"
                            />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-surface-100 text-sm text-center w-full group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
