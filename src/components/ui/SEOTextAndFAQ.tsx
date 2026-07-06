import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface SEOTextAndFAQProps {
    title: string;
    aboutContent?: string | null;
    faqContent?: string | null;
}

export default function SEOTextAndFAQ({ title, aboutContent, faqContent }: SEOTextAndFAQProps) {
    if (!aboutContent && !faqContent) return null;

    let faqs: FAQItem[] = [];
    if (faqContent) {
        try {
            faqs = JSON.parse(faqContent) as FAQItem[];
        } catch (e) {
            console.error("Failed to parse FAQ JSON on SEO component");
        }
    }

    return (
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-sm">
            {aboutContent && (
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        About {title}
                    </h2>
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                        {aboutContent}
                    </div>
                </div>
            )}

            {faqs.length > 0 && (
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details
                                key={index}
                                className="group bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                            >
                                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 dark:text-white hover:bg-violet-50 dark:hover:bg-violet-900/40 transition-colors">
                                    {faq.question}
                                    <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180">
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    </span>
                                </summary>
                                <div className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
