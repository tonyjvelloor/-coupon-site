import { Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ContactFormClient } from "@/components/modules/shared/ContactFormClient";

export const metadata = {
    title: "Contact Us | CouponHub",
    description: "Contact the CouponHub editorial and support team for expired coupon reports, merchant partnerships, editorial corrections, or privacy inquiries.",
};

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pb-16">
            <div className="bg-violet-900 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-violet-200">
                        Report an expired promo code, request an editorial correction, or reach out for merchant partnerships.
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
                                        <h3 className="font-semibold text-gray-900 mb-1">Editorial & User Support</h3>
                                        <p className="text-gray-600 mb-1.5 text-sm">
                                            For broken deal reports, privacy requests, or general questions:
                                        </p>
                                        <a href="mailto:support@couponhub.store" className="text-violet-700 font-semibold hover:text-violet-900 block">
                                            support@couponhub.store
                                        </a>
                                        <a href="mailto:partnerships@couponhub.store" className="text-violet-700 font-medium hover:text-violet-900 text-sm block mt-1">
                                            partnerships@couponhub.store (Merchant Partnerships)
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Publisher & Operations</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            CouponHub (Operated by TheBrandManiacs)<br />
                                            Bengaluru, Karnataka, India<br />
                                            Editorial coverage focused on Indian e-commerce &amp; banking deals.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Support Hours</h3>
                                        <p className="text-gray-600 text-sm">
                                            Monday – Friday: 9:30 AM – 6:30 PM IST<br />
                                            Typical response time: 1–2 business days
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-violet-200/70">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                                        <ShieldCheck className="w-4 h-4 text-violet-600" />
                                        Transparency &amp; Policies
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-violet-700 font-medium">
                                        <Link href="/editorial-policy" className="hover:underline">Editorial Policy</Link>
                                        <Link href="/how-we-verify" className="hover:underline">Verification Process</Link>
                                        <Link href="/disclosure" className="hover:underline">Affiliate &amp; Ad Disclosure</Link>
                                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Contact Form */}
                        <div className="p-8 lg:p-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Have feedback on an offer or want to update merchant details? Use the form below.
                            </p>
                            <ContactFormClient />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
