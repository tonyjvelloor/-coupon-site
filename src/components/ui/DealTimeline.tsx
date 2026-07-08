import React from 'react';
import { Icon } from './Icon';
import { Stack } from './Stack';

export interface DealTimelineEvent {
    id: string;
    type: 'verified' | 'added' | 'expired' | 'updated';
    title: string;
    time: string;
    user?: string;
}

export function DealTimeline({ events }: { events: DealTimelineEvent[] }) {
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'verified': return { icon: 'verified', color: 'text-verified-600', bg: 'bg-verified-100 dark:bg-verified-900/30' };
            case 'added': return { icon: 'add_circle', color: 'text-intelligence-600', bg: 'bg-intelligence-100 dark:bg-intelligence-900/30' };
            case 'expired': return { icon: 'cancel', color: 'text-surface-400', bg: 'bg-surface-100 dark:bg-surface-800' };
            case 'updated': return { icon: 'update', color: 'text-warning-600', bg: 'bg-warning-100 dark:bg-warning-900/30' };
            default: return { icon: 'info', color: 'text-surface-600', bg: 'bg-surface-100 dark:bg-surface-800' };
        }
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500 mb-4 px-2">Recent Activity</h3>
            <div className="relative pl-3">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-surface-200 dark:bg-surface-800"></div>
                <Stack gap={16}>
                    {events.map((event, index) => {
                        const style = getTypeStyles(event.type);
                        return (
                            <div key={event.id} className="flex gap-4 relative z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.color} ring-4 ring-surface-50 dark:ring-surface-950 mt-1`}>
                                    <Icon name={style.icon} className="text-[12px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-merchant-900 dark:text-merchant-50">
                                        {event.title}
                                    </span>
                                    <span className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                                        {event.time} 
                                        {event.user && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-surface-300"></span>
                                                <Icon name="person" className="text-[10px]" /> {event.user}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </Stack>
            </div>
        </div>
    );
}
