"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { InteractiveDealCard } from "./InteractiveDealCard";

interface BlogContentRendererProps {
    content: string;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
    const isHtml = content.trim().startsWith("<") || /<\/?(h[1-6]|p|div|ul|ol|li|table|blockquote)[^>]*>/i.test(content);

    // If it's pure HTML, render HTML with sanitized container
    if (isHtml) {
        return (
            <div 
                className="prose prose-lg prose-indigo max-w-none text-slate-700 leading-relaxed 
                           prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight 
                           prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                           prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 
                           prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                           prose-strong:text-slate-900 prose-strong:font-bold
                           prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-b
                           prose-ul:my-4 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: content }} 
            />
        );
    }

    // Otherwise render with ReactMarkdown
    return (
        <div className="prose prose-lg prose-indigo max-w-none text-slate-700 leading-relaxed
                       prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                       prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                       prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                       prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-slate-900 prose-strong:font-bold
                       prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-b">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
