import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const generatedSignature = (
    razorpayOrderId: string,
    razorpayPaymentId: string
) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
        throw new Error(
            'Razorpay key secret is not defined in environment variables.'
        );
    }
    const sig = crypto
        .createHmac('sha256', keySecret)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');
    return sig;
};


export async function POST(request: NextRequest) {
    try {
        const { orderCreationId, razorpayPaymentId, razorpaySignature } =
            await request.json();

        const signature = generatedSignature(orderCreationId, razorpayPaymentId);
        if (signature !== razorpaySignature) {
            return NextResponse.json({ message: 'Payment Verification Failed', status: 400 });
        }

        // const updatedOrder = await prisma.order.update({
        //     where: {  },
        //     data: {
        //         razorpayPaymentId,
        //         razorpaysignature: razorpaySignature,
        //         status: 'Completed',
        //     },
        // });

        return NextResponse.json({ message: 'Payment Verified Successfully', status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred during payment verification', status: 500 });
    }
}