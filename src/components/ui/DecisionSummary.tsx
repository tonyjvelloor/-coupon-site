import React from 'react';
import { Icon } from './Icon';

interface DecisionSummaryProps {
    storeName: string;
    shouldShop: boolean;
    reasons: string[];
    bestOption?: string;
}

export function DecisionSummary({ storeName, shouldShop, reasons, bestOption }: DecisionSummaryProps) {
    return (
        <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
            
            {/* Left: Primary Decision */}
            <div className="flex-shrink-0 flex flex-col gap-2">
                <h2 className="text-sm font-bold text-surface-500 uppercase tracking-widest">
                    Decision Summary
                </h2>
                <div className="text-lg font-semibold text-merchant-900 dark:text-merchant-50">
                    Should you shop here today?
                </div>
                <div className={`text-4xl font-black font-headline-lg flex items-center gap-2 ${shouldShop ? 'text-verified' : 'text-warning'}`}>
                    {shouldShop ? 'YES' : 'PROCEED WITH CAUTION'}
                    {shouldShop && <Icon name="check_circle" className="text-3xl" />}
                </div>
            </div>

            {/* Middle: Reasons */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 md:pl-8 md:border-l border-surface-200 dark:border-surface-700">
                {reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                        <Icon name="check" className="text-verified shrink-0 mt-0.5" />
                        <span>{reason}</span>
                    </div>
                ))}
            </div>

            {/* Right: Best Option */}
            {bestOption && (
                <div className="flex-shrink-0 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-xl p-4 w-full md:w-auto text-center md:text-left">
                    <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">
                        Best Option
                    </div>
                    <div className="text-xl font-bold text-primary dark:text-primary-400">
                        {bestOption}
                    </div>
                </div>
            )}
        </div>
    );
}
