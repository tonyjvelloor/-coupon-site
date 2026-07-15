type EventProperties = {
    coupon_copied: { couponId: string; storeId?: string };
    deal_clicked: { couponId: string; storeId?: string };
    store_saved: { storeId: string };
    deal_saved: { dealId: string };
    trust_vote: { couponId: string; vote: 'up' | 'down' };
};

export type EventName = keyof EventProperties;

/**
 * Universal analytics wrapper that safely pushes events to connected providers
 * (e.g. Google Analytics 4, Microsoft Clarity, Mixpanel) if they are loaded on the client.
 */
export function trackEvent<T extends EventName>(
    eventName: T,
    properties: EventProperties[T]
) {
    if (typeof window === 'undefined') return;

    // 1. Google Analytics (gtag)
    if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, properties);
    }

    // 2. Microsoft Clarity (if we want to use tags for filtering sessions)
    if (typeof (window as any).clarity === 'function') {
        // Clarity tags must be strings
        const clarityTag = `${eventName}_${Object.values(properties).join('_')}`;
        (window as any).clarity('set', 'event', clarityTag);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}`, properties);
    }
}
