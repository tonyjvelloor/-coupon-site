import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { Icon } from './Icon';

export interface TimelineEvent {
    id: string;
    title: string;
    subtitle: string;
    icon?: string;
    href?: string;
    isActive?: boolean; // For "Next up" or "Just now"
    color?: string; // 'primary', 'green', 'amber', etc.
}

export interface TimelineWidgetProps {
    events: TimelineEvent[];
    className?: string;
}

export function TimelineWidget({ events, className = "" }: TimelineWidgetProps) {
    return (
        <Card className={`p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}>
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-6 relative z-10">
                    {events.map((event, index) => {
                        const isLast = index === events.length - 1;
                        const bgColor = event.isActive ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-800';
                        const iconColor = event.isActive ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400';
                        const borderColor = event.isActive ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-600';
                        
                        const content = (
                            <div className="flex gap-4 group">
                                {/* Node Icon */}
                                <div className={`w-12 h-12 rounded-full border-2 ${borderColor} ${bgColor} flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon name={event.icon || "event"} className={`text-[20px] ${iconColor}`} />
                                </div>
                                
                                {/* Content */}
                                <div className="flex flex-col justify-center pt-1">
                                    <h4 className={`font-bold text-base transition-colors ${event.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                                        {event.title}
                                    </h4>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {event.subtitle}
                                    </span>
                                </div>
                            </div>
                        );

                        return (
                            <div key={event.id} className="relative">
                                {event.href ? (
                                    <Link href={event.href} className="block w-full">
                                        {content}
                                    </Link>
                                ) : (
                                    content
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
