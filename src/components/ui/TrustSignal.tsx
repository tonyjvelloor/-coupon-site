import React from 'react';
import { Card, CardContent } from './Card';
import { Icon } from './Icon';

export function TrustSignal({
    title,
    description,
    icon = "verified_user",
    type = "verified"
}: {
    title: string;
    description: string;
    icon?: string;
    type?: "verified" | "warning" | "neutral" | "success" | "intelligence";
}) {
    const typeColors = {
        verified: "text-verified-600 bg-verified-50 dark:bg-verified-900/30",
        warning: "text-warning-600 bg-warning-50 dark:bg-warning-900/30",
        neutral: "text-surface-600 bg-surface-100 dark:bg-surface-800",
        success: "text-success-600 bg-success-50 dark:bg-success-900/30",
        intelligence: "text-intelligence-600 bg-intelligence-50 dark:bg-intelligence-900/30"
    };

    return (
        <Card className="bg-surface-50 dark:bg-surface-900/50 border-none">
            <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColors[type]}`}>
                    <Icon name={icon} className="text-[18px]" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-merchant-900 dark:text-merchant-50">{title}</span>
                    <span className="text-xs text-surface-600 dark:text-surface-400 mt-0.5 leading-relaxed">{description}</span>
                </div>
            </CardContent>
        </Card>
    );
}
