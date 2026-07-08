import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Dynamic values from URL params
        const title = searchParams.get('title') || 'CouponHub - Best Deals & Offers';
        const description = searchParams.get('description') || 'Save money with the best coupons and cashback offers online.';
        const type = searchParams.get('type') || 'default'; // 'store', 'category', 'deal'
        const logo = searchParams.get('logo'); // optional URL for store logo or category icon

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
                        backgroundColor: '#fff',
                        backgroundImage: 'linear-gradient(to bottom right, #4c1d95, #c026d3, #9d174d)',
                        padding: '40px 80px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '60px 80px',
                            borderRadius: '30px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            width: '100%',
                            height: '100%',
                            border: '2px solid rgba(255,255,255,0.5)',
                        }}
                    >
                        {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logo}
                                alt="Logo"
                                width={120}
                                height={120}
                                style={{
                                    objectFit: 'contain',
                                    marginBottom: '30px',
                                    borderRadius: '16px',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    fontSize: 60,
                                    fontWeight: 900,
                                    background: 'linear-gradient(to right, #4c1d95, #c026d3)',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    marginBottom: '30px',
                                }}
                            >
                                🏷️ CouponHub
                            </div>
                        )}
                        
                        <div
                            style={{
                                fontSize: 60,
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: '#111827',
                                textAlign: 'center',
                                marginBottom: '20px',
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
                                fontSize: 32,
                                color: '#4b5563',
                                textAlign: 'center',
                                maxWidth: '900px',
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
                                bottom: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                color: '#6b7280',
                                fontSize: 24,
                                fontWeight: 600,
                            }}
                        >
                            couponhub.store
                        </div>
                        
                        {type !== 'default' && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 40,
                                    right: 40,
                                    background: '#7c3aed',
                                    color: '#fff',
                                    padding: '8px 20px',
                                    borderRadius: 'full',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {type}
                            </div>
                        )}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.error(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
