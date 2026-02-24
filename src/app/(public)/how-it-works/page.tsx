import { Search, Copy, ShoppingBag, BadgeCheck } from "lucide-react";

export const metadata = {
    title: "How It Works | CouponHub by TheBrandManiacs",
    description: "Learn how to use CouponHub to save money on your online shopping. A simple guide by TheBrandManiacs.",
};

export default function HowItWorksPage() {
    const steps = [
        {
            icon: Search,
            title: "1. Find a Store",
            description: "Search for your favorite online store or browse our categories to find the best deals.",
            color: "blue",
        },
        {
            icon: Copy,
            title: "2. Copy the Code",
            description: "Click on 'Show Coupon' to reveal the code. We'll automatically copy it to your clipboard.",
            color: "violet",
        },
        {
            icon: ShoppingBag,
            title: "3. Shop & Save",
            description: "Go to the store's website, shop as usual, and paste the code at checkout to get your discount.",
            color: "orange",
        },
    ];

    return (
        <div className="bg-white min-h-screen pb-12">
            <div className="bg-gray-50 py-16 lg:py-24 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h1>
                    <p className="text-lg text-gray-600">
                        Saving money with CouponHub is as easy as 1-2-3. No signup required, just pure savings brought to you by <strong>TheBrandManiacs</strong>.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-100 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="bg-white pt-8 pb-6 px-4 text-center group">
                            <div className={`w-24 h-24 mx-auto bg-${step.color}-100 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className={`w-10 h-10 text-${step.color}-600`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-20 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">Do I need to pay to use these coupons?</h3>
                            <p className="text-gray-600">No! All coupons and deals on CouponHub are completely free to use. TheBrandManiacs is committed to free savings for everyone.</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">What if a coupon doesn't work?</h3>
                            <p className="text-gray-600">We verify our coupons regularly, but sometimes offers expire. If a code doesn't work, please try another one or look for a "Get Deal" offer instead.</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">How do I know the coupons are real?</h3>
                            <p className="text-gray-600">Look for the <span className="inline-flex items-center gap-1 text-green-600 font-medium"><BadgeCheck className="w-4 h-4" /> Verified</span> badge. These codes have been tested manually by our team.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
