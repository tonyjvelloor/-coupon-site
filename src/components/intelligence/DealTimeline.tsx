import React from 'react';
import { Icon } from '../ui/Icon';

export interface TimelineEvent {
    id: string;
    timestamp: string; // e.g. "4 minutes ago"
    merchant: string;
    action: string;
    type: 'offers_added' | 'cashback_increased' | 'discount_refreshed' | 'collection_expanded';
}

/**
 * Deal Intelligence Timeline
 * Shows platform activity instead of static marketing copy.
 */
export function DealTimeline({ events }: { events: TimelineEvent[] }) {
    
    const getTypeIcon = (type: TimelineEvent['type']) => {
        switch(type) {
            case 'offers_added': return 'local_offer';
            case 'cashback_increased': return 'payments';
            case 'discount_refreshed': return 'autorenew';
            case 'collection_expanded': return 'library_add';
            default: return 'info';
        }
    };

    return (
        <div className="bg-surface-50 dark:bg-surface-900/50 rounded-2xl p-5 border border-surface-200 dark:border-surface-800">
            <h3 className="font-headline-md text-base font-semibold mb-5 flex items-center gap-2">
                <Icon name="timeline" className="text-primary" />
                Live Platform Intelligence
            </h3>
            <div className="flex flex-col gap-5 relative before:absolute before:inset-y-0 before:left-[13px] before:w-px before:bg-surface-200 dark:before:bg-surface-700">
                {events.map((event) => (
                    <div key={event.id} className="relative flex gap-4 items-start">
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-surface-800 border-2 border-primary flex items-center justify-center z-10 shrink-0 shadow-sm">
                            <Icon name={getTypeIcon(event.type)} className="text-[14px] text-primary" variant="fill" />
                        </div>
                        <div className="flex flex-col pt-0.5">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">
                                Updated {event.timestamp}
                            </span>
                            <span className="text-sm text-on-surface">
                                <span className="font-semibold">{event.merchant}</span> {event.action}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
