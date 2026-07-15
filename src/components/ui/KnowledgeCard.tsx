import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from './Card';
import { Icon } from './Icon';

export interface KnowledgeCardProps {
    article: {
        id: string;
        title: string;
        description: string;
        icon: string;
        category: string;
        href: string;
    };
    className?: string;
}

export function KnowledgeCard({ article, className = "" }: KnowledgeCardProps) {
    return (
        <Card interactive className={`h-full border-surface-200 dark:border-surface-800 hover:border-primary dark:hover:border-primary transition-colors duration-300 group ${className}`}>
            <Link href={article.href} className="flex flex-col h-full p-5">
                
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon name={article.icon} className="text-[20px]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">
                        {article.category}
                    </span>
                </div>
                
                <div className="flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-3 mb-4 flex-grow">
                        {article.description}
                    </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-400 mt-auto pt-4 border-t border-surface-100 dark:border-surface-800">
                    Read More
                    <Icon name="arrow_forward" className="text-[14px] group-hover:translate-x-1 transition-transform" />
                </div>
                
            </Link>
        </Card>
    );
}
