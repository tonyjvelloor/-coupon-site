"use client";

import { useFormState, useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/app/actions/subscribe";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute right-2 top-2 bottom-2 bg-brand-indigo hover:bg-brand-indigo-dark text-white px-6 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Subscribing..." : (
        <>
          Join <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export function NewsletterModule() {
  const [state, formAction] = useFormState(subscribeToNewsletter, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="max-w-max-width mx-auto px-gutter-desktop py-space-xl">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-indigo to-[#2e2692] rounded-3xl p-8 md:p-16 text-center shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-deal-amber opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Don't let another glitch deal expire.
          </h2>
          
          <p className="text-brand-indigo-light text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Join 14,000+ smart shoppers. We'll email you the top 5 highest-saving coupons every Friday. No spam, ever.
          </p>

          <form ref={formRef} action={formAction} className="relative max-w-md mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address..."
              className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-6 pr-32 text-white placeholder:text-brand-indigo-light focus:outline-none focus:ring-2 focus:ring-verified-emerald focus:bg-white/20 transition-all backdrop-blur-md"
            />
            <SubmitButton />
          </form>

          {state?.status === "success" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-verified-emerald font-medium animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{state.message}</span>
            </div>
          )}
          {state?.status === "error" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-400 font-medium animate-in fade-in slide-in-from-bottom-2">
              <span>{state.message}</span>
            </div>
          )}

          <div className="mt-6 text-sm text-brand-indigo-light/80 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-verified-emerald" /> 100% Free</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-verified-emerald" /> 1-Click Unsubscribe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
