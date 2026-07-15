import React from 'react';
import { Icon } from './Icon';

export interface DealTimelineEvent {
    id: string;
    type: 'verified' | 'added' | 'expired' | 'updated' | 'policy' | 'cashback';
    title: string;
    time: string;
    user?: string;
    description?: string;
}

export function DealTimeline({ events }: { events: DealTimelineEvent[] }) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'verified': return { icon: 'verified', color: 'text-verified', bg: 'bg-verified-light dark:bg-verified-dark' };
            case 'added': return { icon: 'add_circle', color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/30' };
            case 'expired': return { icon: 'cancel', color: 'text-surface-400', bg: 'bg-surface-100 dark:bg-surface-800' };
            case 'updated': return { icon: 'update', color: 'text-warning', bg: 'bg-warning-light dark:bg-warning-dark' };
            case 'policy': return { icon: 'policy', color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/30' };
            case 'cashback': return { icon: 'payments', color: 'text-success', bg: 'bg-success-light dark:bg-success-dark' };
            default: return { icon: 'info', color: 'text-surface-600', bg: 'bg-surface-100 dark:bg-surface-800' };
        }
    };

    return (
        <div className="bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 md:p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-500 mb-6">Intelligence Timeline</h3>
            <div className="relative pl-4">
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-surface-200 dark:bg-surface-800"></div>
                <div className="flex flex-col gap-6">
                    {events.map((event, index) => {
                        const style = getTypeStyles(event.type);
                        return (
                            <div key={event.id} className="flex gap-4 relative z-10 group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.color} ring-4 ring-white dark:ring-surface-950`}>
                                    <Icon name={style.icon} className="text-[14px]" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-merchant-900 dark:text-merchant-50">
                                            {event.title}
                                        </span>
                                        <span className="text-xs font-medium text-surface-400">
                                            {event.time}
                                        </span>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                                            {event.description}
                                        </p>
                                    )}
                                    {event.user && (
                                        <div className="text-xs text-surface-400 flex items-center gap-1 mt-2">
                                            <Icon name="person" className="text-[12px]" /> Verified by {event.user}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
