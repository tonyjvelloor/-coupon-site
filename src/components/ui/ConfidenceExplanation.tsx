"use client";

import React, { useState } from 'react';
import { Icon } from './Icon';

interface ConfidenceExplanationProps {
    score: number;
}

export function ConfidenceExplanation({ score }: ConfidenceExplanationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="text-xl font-bold font-metric-xl text-verified flex items-center gap-1 hover:text-verified-high transition-colors focus:outline-none"
            >
                {score}%
                <Icon name="info" className="text-[16px] text-surface-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 mt-2 w-64 bg-slate-900 dark:bg-slate-900-dark border border-surface-700 shadow-overlay rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-fast">
                    <div className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-3">
                        Confidence Score Breakdown
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-surface-100">
                            <Icon name="check_circle" className="text-verified text-[16px]" />
                            Verified today
                        </div>
                        <div className="flex items-center gap-2 text-sm text-surface-100">
                            <Icon name="check_circle" className="text-verified text-[16px]" />
                            Offer validated
                        </div>
                        <div className="flex items-center gap-2 text-sm text-surface-100">
                            <Icon name="check_circle" className="text-verified text-[16px]" />
                            Merchant verified
                        </div>
                        <div className="flex items-center gap-2 text-sm text-surface-100">
                            <Icon name="check_circle" className="text-verified text-[16px]" />
                            Policy verified
                        </div>
                        <div className="flex items-center gap-2 text-sm text-surface-100">
                            <Icon name="check_circle" className="text-verified text-[16px]" />
                            History consistent
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
