import React from 'react';
import Link from 'next/link';
import { Icon } from "@/components/ui/Icon";
import { KnowledgeGraphService } from "@/lib/intelligence/services/knowledge-graph.service";
import { prisma } from "@/lib/db";

const kgService = new KnowledgeGraphService();

export async function DecisionGraph({ merchantId, storeSlug }: { merchantId: string, storeSlug: string }) {
    // Look up the merchant node in the graph
    const merchantNode = await prisma.knowledgeNode.findFirst({
        where: { type: "MERCHANT", entityId: merchantId }
    });

    if (!merchantNode) return null;

    const graph = await kgService.traverseMerchantGraph(merchantNode.id);

    // If graph is sparse, we don't render it all
    if (!graph.explore.length && !graph.whatsNew.length && !graph.continueShopping.length && !graph.trustAndPolicies.length) {
        return null;
    }

    return (
        <section className="mt-16 bg-surface-50 dark:bg-surface-900/50 rounded-3xl p-8 border border-surface-200 dark:border-surface-800">
            <header className="mb-8">
                <h2 className="text-2xl font-headline-lg font-bold text-on-surface">Decision Graph</h2>
                <p className="text-on-surface-variant font-medium mt-2">Explore related intelligence and decisions for this merchant.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* 1. Explore */}
                {graph.explore.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-on-surface flex items-center gap-2 text-lg border-b border-surface-200 dark:border-surface-800 pb-2">
                            <Icon name="explore" className="text-primary" /> Explore
                        </h3>
                        <ul className="space-y-3">
                            {graph.explore.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={`/search?q=${encodeURIComponent(item.node.name)}`} className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700 shadow-sm">
                                        <div>
                                            <span className="block text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.node.name}</span>
                                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{item.node.type}</span>
                                        </div>
                                        <Icon name="arrow_forward" className="text-surface-400 group-hover:text-primary transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 2. What's New */}
                {graph.whatsNew.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-on-surface flex items-center gap-2 text-lg border-b border-surface-200 dark:border-surface-800 pb-2">
                            <Icon name="new_releases" className="text-secondary" /> What's New
                        </h3>
                        <ul className="space-y-3">
                            {graph.whatsNew.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={`/events/${item.node.id}`} className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700 shadow-sm">
                                        <div>
                                            <span className="block text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">{item.node.name}</span>
                                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{item.node.type}</span>
                                        </div>
                                        <Icon name="arrow_forward" className="text-surface-400 group-hover:text-secondary transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 3. Trust & Policies */}
                {graph.trustAndPolicies.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-on-surface flex items-center gap-2 text-lg border-b border-surface-200 dark:border-surface-800 pb-2">
                            <Icon name="shield" className="text-verified-green" /> Trust & Policies
                        </h3>
                        <ul className="space-y-3">
                            {graph.trustAndPolicies.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-sm">
                                    <Icon name="verified" className="text-verified-green text-[20px]" />
                                    <div>
                                        <span className="block text-sm font-bold text-on-surface">{item.node.name}</span>
                                        <span className="text-xs text-on-surface-variant font-medium">Verified Source</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Continue Shopping */}
                {graph.continueShopping.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-on-surface flex items-center gap-2 text-lg border-b border-surface-200 dark:border-surface-800 pb-2">
                            <Icon name="shopping_bag" className="text-urgency-orange" /> Continue Shopping
                        </h3>
                        <ul className="space-y-3">
                            {graph.continueShopping.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={`/guides/${item.node.id}`} className="group flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700 shadow-sm">
                                        <div>
                                            <span className="block text-sm font-bold text-on-surface group-hover:text-urgency-orange transition-colors">{item.node.name}</span>
                                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">{item.node.type}</span>
                                        </div>
                                        <Icon name="arrow_forward" className="text-surface-400 group-hover:text-urgency-orange transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
