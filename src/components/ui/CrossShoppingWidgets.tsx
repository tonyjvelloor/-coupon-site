import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

interface CrossShoppingWidgetsProps {
    storeName: string;
    competitors?: {
        name: string;
        slug: string;
        savings: string;
        isBetter: boolean;
    }[];
    popularCategories?: {
        name: string;
        slug: string;
    }[];
}

export function CrossShoppingWidgets({ storeName, competitors, popularCategories }: CrossShoppingWidgetsProps) {
    return (
        <div className="space-y-6">
            {/* Can I save more elsewhere? */}
            <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
                <h3 className="font-bold text-merchant-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Icon name="compare" className="text-surface-500" /> Save more elsewhere?
                </h3>
                <div className="space-y-3">
                    {(competitors || [
                        { name: 'Amazon', slug: 'amazon', savings: '₹3,200 Savings', isBetter: false },
                        { name: 'Flipkart', slug: 'flipkart', savings: '₹3,600 Savings', isBetter: true },
                        { name: 'Croma', slug: 'croma', savings: '₹2,900 Savings', isBetter: false }
                    ]).map(comp => (
                        <Link href={`/stores/${comp.slug}`} key={comp.name} className={`flex items-center justify-between p-3 bg-white rounded-xl border ${comp.isBetter ? 'border-primary/50 shadow-sm relative overflow-hidden' : 'border-surface-200'}`}>
                            {comp.isBetter && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                            <span className="font-bold text-merchant-900">{comp.name}</span>
                            <span className="font-bold text-green-600">{comp.savings}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Shopping Categories */}
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                <div className="p-4 bg-surface-50 border-b border-surface-200">
                    <h3 className="font-bold text-merchant-900 text-sm flex items-center gap-2">
                        <Icon name="category" className="text-surface-400" /> Popular Categories
                    </h3>
                </div>
                <div className="divide-y divide-surface-100 p-2 flex flex-wrap gap-2">
                    {(popularCategories || [
                        { name: 'Phones', slug: 'phones' },
                        { name: 'Laptops', slug: 'laptops' },
                        { name: 'Home Appliances', slug: 'home-appliances' },
                        { name: 'Fashion', slug: 'fashion' },
                        { name: 'Travel', slug: 'travel' }
                    ]).map(cat => (
                        <Link key={cat.name} href={`/category/${cat.slug}`} className="px-3 py-1.5 bg-surface-100 hover:bg-surface-200 text-surface-700 text-sm font-medium rounded-full transition">
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Continue Shopping (Recently Viewed) */}
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
                <div className="p-4 bg-surface-50 border-b border-surface-200">
                    <h3 className="font-bold text-merchant-900 text-sm flex items-center gap-2">
                        <Icon name="history" className="text-surface-400" /> Continue Shopping
                    </h3>
                </div>
                <div className="divide-y divide-surface-100">
                    {['Amazon', 'Flipkart', 'AJIO'].map(name => (
                        <Link key={name} href={`/stores/${name.toLowerCase().replace(' ', '-')}`} className="flex items-center justify-between p-4 hover:bg-surface-50 transition group">
                            <span className="font-semibold text-surface-700 group-hover:text-primary transition">{name}</span>
                            <Icon name="arrow_forward" className="text-surface-300 group-hover:text-primary transition" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
