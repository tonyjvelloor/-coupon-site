import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Bank & Credit Card Offers - CouponHub",
    description:
        "Find the best discounts, cashbacks, and coupon codes for HDFC, ICICI, SBI, Axis, and other major banks.",
};

export const revalidate = 3600;

export default async function BanksIndexPage() {
    const banks = await prisma.bank.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
            _count: { select: { bankOffers: { where: { isActive: true } } } },
        },
    });

    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Bank & Card Offers</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Maximize your savings with exclusive credit card and debit card offers. Browse all active bank deals across top merchants.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {banks.map((bank) => (
                        <Link
                            key={bank.id}
                            href={`/banks/${bank.slug}`}
                            className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-blue-300 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mb-4 overflow-hidden border border-gray-100">
                                {bank.logo ? (
                                    <Image src={bank.logo} alt={bank.name} width={64} height={64} className="object-cover" />
                                ) : (
                                    <Icon name="account_balance" className="w-8 h-8 text-blue-600" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {bank.name}
                            </h2>
                            <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {bank._count.bankOffers} Active Offers
                            </p>
                        </Link>
                    ))}
                </div>
                {banks.length === 0 && (
                    <div className="text-center py-20">
                        <Icon name="credit_card" className="text-6xl text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No Banks Found</h3>
                        <p className="text-gray-500 mt-2">Check back later for new bank offers.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
