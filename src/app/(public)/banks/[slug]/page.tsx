import { prisma } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const revalidate = 900;

export async function generateStaticParams() {
    try {
        const banks = await prisma.bank.findMany({
            where: { isActive: true },
            select: { slug: true },
        });
        return banks.map((b) => ({ slug: b.slug }));
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const bank = await prisma.bank.findUnique({
        where: { slug, isActive: true },
    });

    if (!bank) return { title: "Bank Not Found" };

    const ogTitle = bank.seoTitle || `${bank.name} Credit Card Offers & Coupons | CouponHub`;
    const ogDescription = bank.description || `Maximize your savings with the latest ${bank.name} credit and debit card offers.`;

    return {
        title: ogTitle,
        description: ogDescription,
    };
}

export default async function BankPage({ params }: PageProps) {
    const { slug } = await params;

    const bank = await prisma.bank.findUnique({
        where: { slug, isActive: true },
        include: {
            bankOffers: {
                where: { isActive: true },
                include: { store: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!bank) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen pb-24">
            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Breadcrumbs items={[
                    { name: "Banks", href: "/banks" },
                    { name: bank.name }
                ]} />
            </div>

            {/* Header */}
            <section className="bg-white dark:bg-surface-950 border-y border-surface-200 dark:border-surface-800 py-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-800 overflow-hidden relative">
                            {bank.logo ? (
                                <Image src={bank.logo} alt={bank.name} fill className="object-cover" />
                            ) : (
                                <Icon name="account_balance" className="text-4xl text-blue-600 dark:text-blue-400" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl md:text-5xl font-headline-lg font-bold text-slate-900 dark:text-white">
                                {bank.name} Offers
                            </h1>
                            <p className="text-surface-600 dark:text-surface-400 text-lg max-w-3xl">
                                {bank.description || `Explore exclusive ${bank.name} credit and debit card deals across top merchants.`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="local_offer" className="text-2xl text-blue-600" />
                        <h2 className="text-2xl font-headline-md font-bold text-slate-900 dark:text-white">
                            Top {bank.name} Discounts
                        </h2>
                    </div>

                    {bank.bankOffers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bank.bankOffers.map((offer) => (
                                <div key={offer.id} className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {offer.store?.logo ? (
                                                <Image src={offer.store.logo} alt={offer.store.name} width={48} height={48} className="object-cover" />
                                            ) : (
                                                <Icon name="storefront" className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{offer.store?.name || "Multiple Stores"}</h3>
                                            <p className="text-sm text-gray-500 font-medium text-blue-600">{offer.discountDetails}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden line-clamp-2">
                                        {offer.terms || "Standard terms and conditions apply."}
                                    </p>
                                    <Link 
                                        href={offer.store ? `/store/${offer.store.slug}` : "#"} 
                                        className="block w-full text-center bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2 rounded-lg transition-colors"
                                    >
                                        View Deals
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-dashed border-surface-300 dark:border-surface-700">
                            <Icon name="credit_card_off" className="text-4xl text-surface-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No active offers</h3>
                            <p className="text-surface-500 max-w-md mx-auto mb-6">
                                There are currently no active offers for this bank. Please check back later.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
