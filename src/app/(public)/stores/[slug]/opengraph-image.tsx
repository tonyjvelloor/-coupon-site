import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'CouponHub Store Deals';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const store = await prisma.store.findUnique({
        where: { slug: params.slug },
        include: {
            merchantIdentity: {
                include: { coupons: { where: { isActive: true }, orderBy: { discountValue: 'desc' }, take: 1 } }
            }
        }
    });

    if (!store) {
        return new ImageResponse(
            (
                <div style={{ fontSize: 40, color: 'black', background: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    CouponHub
                </div>
            ),
            { ...size }
        );
    }

    const coupons = store.merchantIdentity?.coupons || [];
    const bestDeal = coupons.length > 0 ? coupons[0].title : `${store.offerCount || 10}+ Active Deals`;
    const discountValue = coupons.length > 0 && coupons[0].discountValue ? coupons[0].discountValue : 'Save Big';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #4c1d95 0%, #312e81 50%, #0f172a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '60px',
                        borderRadius: '30px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                        {store.logo ? (
                            <img src={store.logo} alt={store.name} width={120} height={120} style={{ objectFit: 'contain' }} />
                        ) : (
                            <div style={{ fontSize: '80px', fontWeight: 'bold', color: '#4c1d95' }}>{store.name.charAt(0)}</div>
                        )}
                        <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#0f172a', marginLeft: '30px' }}>
                            {store.name}
                        </h1>
                    </div>

                    <div style={{ fontSize: '90px', fontWeight: '900', color: '#7c3aed', marginBottom: '20px', textAlign: 'center' }}>
                        {discountValue}
                    </div>

                    <div style={{ fontSize: '36px', fontWeight: '600', color: '#475569', textAlign: 'center', maxWidth: '800px' }}>
                        {bestDeal}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#059669', padding: '10px 20px', borderRadius: '40px', fontSize: '24px', fontWeight: 'bold' }}>
                            ✓ Verified Today
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', color: '#64748b', padding: '10px 20px', borderRadius: '40px', fontSize: '24px', fontWeight: 'bold' }}>
                            CouponHub.store
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
