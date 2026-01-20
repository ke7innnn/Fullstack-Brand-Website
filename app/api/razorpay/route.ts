import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export async function POST(request: Request) {
    try {
        const rzp = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
        });

        const { amount } = await request.json();

        // Warning specific to missing keys
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            throw new Error("Server Environment Variable NEXT_PUBLIC_RAZORPAY_KEY_ID is missing.");
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "USD",
            receipt: "receipt_" + Date.now(),
        };

        const order = await rzp.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to create order",
            details: error
        }, { status: 500 });
    }
}
