import { Star, CheckCircle, Quote } from "lucide-react";

interface TrustWidgetProps {
    platform?: "trustpilot" | "google" | "mixed";
}

export default function TrustWidget({ platform = "mixed" }: TrustWidgetProps) {
    const reviews = [
        {
            name: "Sarah Jenkins",
            rating: 5,
            date: "2 days ago",
            text: "Honestly the only coupon site I use now. Their Amazon flash deals are actually real and the codes always work.",
            platform: "google",
            avatar: "SJ"
        },
        {
            name: "Michael Chen",
            rating: 5,
            date: "1 week ago",
            text: "Saved $120 on my new laptop yesterday. The AI crawler found a stackable discount I didn't even know existed!",
            platform: "trustpilot",
            avatar: "MC"
        },
        {
            name: "Emma Davis",
            rating: 5,
            date: "3 weeks ago",
            text: "Love the clean interface without all the spammy popups of other sites. The 'Verified Today' tags are a lifesaver.",
            platform: "google",
            avatar: "ED"
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Excellent</h3>
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="w-8 h-8 bg-[#00b67a] rounded-sm flex items-center justify-center">
                                <Star className="w-5 h-5 text-white fill-current" />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                        Based on <strong className="text-gray-900 dark:text-gray-300">2,481 reviews</strong>
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <CheckCircle className="w-8 h-8 text-[#00b67a]" />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">100% Verified Codes</p>
                        <p className="text-sm text-gray-500">Checked daily by our AI</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, i) => (
                    <div key={i} className="flex flex-col">
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-4 h-4 ${review.platform === 'trustpilot' ? 'text-[#00b67a] fill-[#00b67a]' : 'text-yellow-400 fill-yellow-400'}`} />
                            ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 flex-1">
                            "{review.text}"
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 flex items-center justify-center text-xs font-bold font-mono">
                                    {review.avatar}
                                </div>
                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-200">{review.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{review.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
