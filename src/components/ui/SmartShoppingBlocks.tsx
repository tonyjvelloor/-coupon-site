import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { StoreContentDTO } from "@/lib/repositories/dtos";

interface SmartShoppingBlocksProps {
    storeName: string;
    contents?: StoreContentDTO[];
}

export function SmartShoppingBlocks({ storeName, contents = [] }: SmartShoppingBlocksProps) {
    const getPolicy = (type: string) => contents.find(c => c.type === type)?.content;
    const shipping = getPolicy('SHIPPING');
    const returns = getPolicy('RETURNS');
    const warranty = getPolicy('WARRANTY');
    const student = getPolicy('STUDENT');
    
    const hasPolicies = shipping || returns || warranty || student;
    const tipsRaw = getPolicy('BUYING_GUIDE');
    const tips = tipsRaw ? tipsRaw.split('\n').filter(Boolean) : [
        "Always compare Cashback before checkout",
        "Try HDFC Cards for maximum rewards",
        "Prime members save more on shipping"
    ];
    return (
        <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-headline-md font-bold text-merchant-900 flex items-center gap-2">
                <Icon name="lightbulb" className="text-primary text-2xl" /> Smart Shopping
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Shopping Tips */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
                    <h3 className="font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="tips_and_updates" className="text-surface-500" /> Shopping Tips
                    </h3>
                    <ul className="space-y-3 relative">
                        {/* Vertical connection line */}
                        <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-surface-200 z-0"></div>
                        {tips.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 relative z-10 items-start">
                                <div className="w-4 h-4 rounded-full bg-surface-200 border-2 border-white mt-1 shrink-0"></div>
                                <span className="text-sm font-medium text-surface-700">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 2. Buying Advice */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
                    <h3 className="font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="analytics" className="text-surface-500" /> Buying Advice
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="font-bold text-green-700">Good Time</span>
                    </div>
                    <p className="text-sm text-surface-600 mb-4 font-medium">Prices are currently stable.</p>
                    
                    <div className="bg-white rounded-xl p-3 border border-surface-200 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-surface-500">Expected Savings</span>
                            <span className="font-bold text-merchant-900">₹1,200</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-surface-500">Next Major Sale</span>
                            <span className="font-bold text-primary">Prime Day</span>
                        </div>
                    </div>
                </div>

                {/* 3. Policies */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6">
                    <h3 className="font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="gavel" className="text-surface-500" /> Policies
                    </h3>
                    <ul className="space-y-3">
                        {(shipping || !hasPolicies) && (
                            <li className="flex items-start gap-2 text-sm">
                                <Icon name="local_shipping" className="text-surface-400 text-[18px] shrink-0" />
                                <span className="text-surface-700 font-medium"><strong className="text-merchant-900">Shipping:</strong> {shipping || "Free over ₹499"}</span>
                            </li>
                        )}
                        {(returns || !hasPolicies) && (
                            <li className="flex items-start gap-2 text-sm">
                                <Icon name="assignment_return" className="text-surface-400 text-[18px] shrink-0" />
                                <span className="text-surface-700 font-medium"><strong className="text-merchant-900">Returns:</strong> {returns || "7-day no-questions-asked"}</span>
                            </li>
                        )}
                        {(warranty || !hasPolicies) && (
                            <li className="flex items-start gap-2 text-sm">
                                <Icon name="verified_user" className="text-surface-400 text-[18px] shrink-0" />
                                <span className="text-surface-700 font-medium"><strong className="text-merchant-900">Warranty:</strong> {warranty || "Brand warranty applicable"}</span>
                            </li>
                        )}
                        {(student || !hasPolicies) && (
                            <li className="flex items-start gap-2 text-sm">
                                <Icon name="school" className="text-surface-400 text-[18px] shrink-0" />
                                <span className="text-surface-700 font-medium"><strong className="text-merchant-900">Student:</strong> {student || "Extra 10% off with UNiDAYS"}</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* 4. Learn More */}
                <div className="bg-surface-50 border border-surface-200 rounded-2xl p-6 flex flex-col">
                    <h3 className="font-bold text-merchant-900 mb-4 flex items-center gap-2">
                        <Icon name="library_books" className="text-surface-500" /> Learn More
                    </h3>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <Link href={`/guides/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white border border-surface-200 rounded-xl p-3 hover:border-primary hover:text-primary transition group text-center">
                            <Icon name="menu_book" className="mb-1 text-surface-400 group-hover:text-primary transition" />
                            <span className="text-xs font-bold text-merchant-900 group-hover:text-primary transition">Buying Guide</span>
                        </Link>
                        <Link href={`/faq/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white border border-surface-200 rounded-xl p-3 hover:border-primary hover:text-primary transition group text-center">
                            <Icon name="help_outline" className="mb-1 text-surface-400 group-hover:text-primary transition" />
                            <span className="text-xs font-bold text-merchant-900 group-hover:text-primary transition">FAQs</span>
                        </Link>
                        <Link href={`/compare/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white border border-surface-200 rounded-xl p-3 hover:border-primary hover:text-primary transition group text-center">
                            <Icon name="compare_arrows" className="mb-1 text-surface-400 group-hover:text-primary transition" />
                            <span className="text-xs font-bold text-merchant-900 group-hover:text-primary transition">Comparison</span>
                        </Link>
                        <Link href={`/timeline/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white border border-surface-200 rounded-xl p-3 hover:border-primary hover:text-primary transition group text-center">
                            <Icon name="timeline" className="mb-1 text-surface-400 group-hover:text-primary transition" />
                            <span className="text-xs font-bold text-merchant-900 group-hover:text-primary transition">Timeline</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
