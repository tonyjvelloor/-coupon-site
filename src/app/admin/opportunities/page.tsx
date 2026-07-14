import React from 'react';
import { prisma } from "@/lib/db";
import { Icon } from "@/components/ui/Icon";

export default async function OpportunitiesDashboard() {
    const opportunities = await prisma.opportunity.findMany({
        where: { status: { notIn: ["COMPLETED", "DISMISSED"] } },
        orderBy: { confidence: 'desc' },
    });

    const getImpactColor = (impact: string) => {
        if (impact === 'High') return 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40';
        if (impact === 'Medium') return 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40';
        return 'text-surface-700 bg-surface-100 dark:text-surface-300 dark:bg-surface-800';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between border-b border-surface-200 dark:border-surface-800 pb-6">
                <div>
                    <h1 className="text-3xl font-headline-lg font-bold text-on-surface flex items-center gap-3">
                        <Icon name="lightbulb" className="text-urgency-orange text-[32px]" variant="fill" />
                        Opportunity Engine
                    </h1>
                    <p className="text-on-surface-variant font-medium mt-2">
                        AI-generated business hypotheses prioritized by graph density and revenue impact.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-on-surface font-semibold px-4 py-2 rounded-lg transition-colors border border-surface-200 dark:border-surface-700">
                        Filter by Type
                    </button>
                    <button className="bg-primary hover:bg-primary-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        <Icon name="bolt" className="text-[18px]" variant="fill" /> Run Global Analysis
                    </button>
                </div>
            </header>

            <div className="grid gap-4">
                {opportunities.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">
                        <Icon name="check_circle" className="text-[48px] text-verified-green mb-4" variant="fill" />
                        <h3 className="text-xl font-bold text-on-surface">All Opportunities Addressed</h3>
                        <p className="text-on-surface-variant mt-2 max-w-md mx-auto">
                            The AI has not detected any new high-impact opportunities in the Merchant Knowledge Graph.
                        </p>
                    </div>
                ) : (
                    opportunities.map(opp => (
                        <div key={opp.id} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
                            
                            {/* Score & Type */}
                            <div className="flex flex-col items-center justify-center min-w-[120px] shrink-0 md:border-r border-surface-100 dark:border-surface-800 pr-0 md:pr-6">
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{opp.subType || opp.type}</span>
                                <span className={`text-5xl font-headline-lg font-black ${opp.confidence >= 90 ? 'text-urgency-orange' : 'text-primary'}`}>
                                    {opp.confidence}
                                </span>
                                <span className="text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-wide">Score</span>
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-xl font-bold text-on-surface">{opp.title}</h2>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-100 dark:bg-surface-800 text-on-surface-variant border border-surface-200 dark:border-surface-700">
                                        {opp.status}
                                    </span>
                                </div>
                                <p className="text-on-surface-variant leading-relaxed">
                                    <strong className="text-on-surface font-semibold">Hypothesis:</strong> {opp.description}
                                </p>
                                <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30">
                                    <strong className="text-primary-900 dark:text-primary-100 text-sm block mb-1 flex items-center gap-1">
                                        <Icon name="arrow_forward" className="text-[16px]" /> Recommended Action:
                                    </strong>
                                    <span className="text-primary-800 dark:text-primary-200 text-sm font-medium">{opp.recommendedAction}</span>
                                </div>
                            </div>

                            {/* Metrics & Actions */}
                            <div className="flex flex-col gap-3 min-w-[220px] shrink-0">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span className="block text-on-surface-variant font-semibold mb-1">Traffic Gain</span>
                                        <span className={`font-bold ${getImpactColor(opp.trafficGain)} px-2 py-0.5 rounded`}>+{opp.estimatedTrafficGain}%</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span className="block text-on-surface-variant font-semibold mb-1">Revenue</span>
                                        <span className={`font-bold ${getImpactColor(opp.revenueImpact)} px-2 py-0.5 rounded`}>{opp.revenueImpact}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span className="block text-on-surface-variant font-semibold mb-1">Effort</span>
                                        <span className={`font-bold ${getImpactColor(opp.estimatedEffort)} px-2 py-0.5 rounded`}>{opp.estimatedEffort}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span className="block text-on-surface-variant font-semibold mb-1">AI Confidence</span>
                                        <span className="font-bold text-on-surface px-2 py-0.5">{opp.confidence}%</span>
                                    </div>
                                </div>
                                <div className="mt-auto flex gap-2 pt-2">
                                    <button className="flex-1 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-on-surface text-sm font-bold py-2.5 rounded-lg transition-colors border border-surface-200 dark:border-surface-700">
                                        Dismiss
                                    </button>
                                    <button className="flex-1 bg-primary hover:bg-primary-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                                        Approve
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
