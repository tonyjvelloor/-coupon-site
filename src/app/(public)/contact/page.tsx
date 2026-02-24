import { Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
    title: "Contact Us | CouponHub by TheBrandManiacs",
    description: "Get in touch with TheBrandManiacs team. We are here to help you with any questions about CouponHub.",
};

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pb-12">
            <div className="bg-violet-900 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-violet-200">
                        Have questions or suggestions? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-2">
                        {/* Contact Info */}
                        <div className="bg-violet-50 p-8 lg:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                                        <p className="text-gray-600 mb-2">Our team is here to help.</p>
                                        <a href="mailto:support@thebrandmaniacs.com" className="text-violet-700 font-medium hover:text-violet-900">
                                            support@thebrandmaniacs.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                                        <p className="text-gray-600">
                                            TheBrandManiacs HQ<br />
                                            Operating Globally<br />
                                            with Local Support
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                                        <p className="text-gray-600">
                                            Mon-Fri: 9:00 AM - 6:00 PM<br />
                                            Sat-Sun: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form (Visual) */}
                        <div className="p-8 lg:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
