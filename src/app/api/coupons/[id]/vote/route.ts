import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        if (typeof body.isUpvote !== 'boolean') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Ideally, in production we would track IP/Session to prevent double voting.
        // For this MVP, we simply increment the counter based on the client request.
        
        const updateData = body.isUpvote 
            ? { successCount: { increment: 1 } }
            : { failureCount: { increment: 1 } };

        const coupon = await prisma.coupon.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                successCount: true,
                failureCount: true,
            }
        });

        // Calculate success rate dynamically based on new values
        const totalVotes = coupon.successCount + coupon.failureCount;
        const successRate = totalVotes > 0 
            ? Math.round((coupon.successCount / totalVotes) * 100) 
            : null;

        return NextResponse.json({ 
            success: true, 
            successRate,
            successCount: coupon.successCount,
            failureCount: coupon.failureCount 
        });
        
    } catch (error) {
        console.error("Failed to process vote:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
