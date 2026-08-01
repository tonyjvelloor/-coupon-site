import Link from "next/link";
import { StoreContentDTO } from "@/lib/repositories/dtos";
import { Lightbulb, Sparkles, LineChart, Scale, Truck, RotateCcw, ShieldCheck, GraduationCap, BookOpen, HelpCircle, GitCompare, Clock } from 'lucide-react';

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
            <h2 className="text-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="text-brand-indigo w-6 h-6" /> Smart Shopping
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Shopping Tips */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles className="text-amber-500 w-5 h-5" /> Shopping Tips
                    </h3>
                    <ul className="space-y-4 relative">
                        {/* Vertical connection line */}
                        <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>
                        {tips.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 relative z-10 items-start">
                                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-slate-50 dark:border-slate-900 mt-1 shrink-0"></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 2. Buying Advice */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <LineChart className="text-brand-indigo w-5 h-5" /> Buying Advice
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-emerald"></span>
                        </span>
                        <span className="font-bold text-brand-emerald">Good Time</span>
                    </div>
                    <p className="text-body text-slate-600 dark:text-slate-400 mb-4">Prices are currently stable.</p>
                    
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Expected Savings</span>
                            <span className="font-bold text-slate-900 dark:text-white">₹1,200</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Next Major Sale</span>
                            <span className="font-bold text-brand-indigo">Prime Day</span>
                        </div>
                    </div>
                </div>

                {/* 3. Policies */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Scale className="text-slate-500 w-5 h-5" /> Policies
                    </h3>
                    <ul className="space-y-4">
                        {(shipping || !hasPolicies) && (
                            <li className="flex items-start gap-3 text-sm">
                                <Truck className="text-slate-400 w-5 h-5 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium"><strong className="text-slate-900 dark:text-white">Shipping:</strong> {shipping || "Free over ₹499"}</span>
                            </li>
                        )}
                        {(returns || !hasPolicies) && (
                            <li className="flex items-start gap-3 text-sm">
                                <RotateCcw className="text-slate-400 w-5 h-5 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium"><strong className="text-slate-900 dark:text-white">Returns:</strong> {returns || "7-day no-questions-asked"}</span>
                            </li>
                        )}
                        {(warranty || !hasPolicies) && (
                            <li className="flex items-start gap-3 text-sm">
                                <ShieldCheck className="text-slate-400 w-5 h-5 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium"><strong className="text-slate-900 dark:text-white">Warranty:</strong> {warranty || "Brand warranty applicable"}</span>
                            </li>
                        )}
                        {(student || !hasPolicies) && (
                            <li className="flex items-start gap-3 text-sm">
                                <GraduationCap className="text-slate-400 w-5 h-5 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium"><strong className="text-slate-900 dark:text-white">Student:</strong> {student || "Extra 10% off with UNiDAYS"}</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* 4. Learn More */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-sm">
                    <h3 className="text-section text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <BookOpen className="text-brand-indigo w-5 h-5" /> Learn More
                    </h3>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <Link href={`/guides/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-indigo/50 hover:shadow-premium-sm transition-all group text-center">
                            <BookOpen className="w-5 h-5 mb-2 text-slate-400 group-hover:text-brand-indigo transition-colors" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">Buying Guide</span>
                        </Link>
                        <Link href={`/faq/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-indigo/50 hover:shadow-premium-sm transition-all group text-center">
                            <HelpCircle className="w-5 h-5 mb-2 text-slate-400 group-hover:text-brand-indigo transition-colors" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">FAQs</span>
                        </Link>
                        <Link href={`/compare/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-indigo/50 hover:shadow-premium-sm transition-all group text-center">
                            <GitCompare className="w-5 h-5 mb-2 text-slate-400 group-hover:text-brand-indigo transition-colors" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">Comparison</span>
                        </Link>
                        <Link href={`/timeline/${storeName.toLowerCase()}`} className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-indigo/50 hover:shadow-premium-sm transition-all group text-center">
                            <Clock className="w-5 h-5 mb-2 text-slate-400 group-hover:text-brand-indigo transition-colors" />
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">Timeline</span>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
