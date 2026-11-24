import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const reqUrl = new URL(request.url);
        const { searchParams } = reqUrl;

        // Dynamic values from URL params (trimmed cleanly to avoid Satori layout overflow)
        const rawTitle = searchParams.get('title') || 'CouponHub - Best Deals & Offers';
        const rawDescription =
            searchParams.get('description') ||
            'Save money with verified promo codes, bank card offers, and seasonal deals in India.';
        const title = rawTitle.length > 95 ? `${rawTitle.slice(0, 92)}...` : rawTitle;
        const description =
            rawDescription.length > 165 ? `${rawDescription.slice(0, 162)}...` : rawDescription;
        const type = searchParams.get('type') || 'default';
        const rawLogo = searchParams.get('logo');

        // Resolve relative logo paths to absolute HTTPS URLs so Satori can load them
        let logoUrl: string | null = null;
        if (rawLogo) {
            if (rawLogo.startsWith('https://') || rawLogo.startsWith('http://')) {
                logoUrl = rawLogo;
            } else if (rawLogo.startsWith('/')) {
                const origin = process.env.NEXT_PUBLIC_SITE_URL || reqUrl.origin;
                logoUrl = `${origin}${rawLogo}`;
            }
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#4c1d95',
                        backgroundImage: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 55%, #1e1b4b 100%)',
                        padding: '44px 72px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.96)',
                            padding: '56px 72px',
                            borderRadius: 30,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                            width: '100%',
                            height: '100%',
                            border: '2px solid rgba(255,255,255,0.6)',
                            position: 'relative',
                        }}
                    >
                        {type !== 'default' && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 32,
                                    right: 36,
                                    display: 'flex',
                                    backgroundColor: '#7c3aed',
                                    color: '#ffffff',
                                    padding: '8px 20px',
                                    borderRadius: 9999,
                                    fontSize: 18,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                }}
                            >
                                {type}
                            </div>
                        )}

                        {logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoUrl}
                                alt="Logo"
                                width={108}
                                height={108}
                                style={{
                                    objectFit: 'contain',
                                    marginBottom: 24,
                                    borderRadius: 16,
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: 44,
                                    fontWeight: 900,
                                    color: '#6d28d9',
                                    marginBottom: 24,
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                CouponHub India
                            </div>
                        )}

                        <div
                            style={{
                                fontSize: 48,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: '#111827',
                                textAlign: 'center',
                                marginBottom: 18,
                                lineHeight: 1.2,
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                            }}
                        >
                            {title}
                        </div>

                        <div
                            style={{
                                fontSize: 26,
                                color: '#4b5563',
                                textAlign: 'center',
                                maxWidth: '880px',
                                lineHeight: 1.4,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {description}
                        </div>

                        <div
                            style={{
                                position: 'absolute',
                                bottom: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6b7280',
                                fontSize: 22,
                                fontWeight: 600,
                            }}
                        >
                            couponhub.store · Verified Deals & Bank Offers
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                headers: {
                    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
                },
            }
        );
    } catch (e: any) {
        console.error(`[api/og] error: ${e?.message || e}`);
        return new Response('Failed to generate the image', {
            status: 500,
        });
    }
}
