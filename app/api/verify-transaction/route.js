import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { reference } = await request.json();
    if (!reference) {
      return NextResponse.json(
        { status: false, message: "No reference provided" },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (verifyData.status && verifyData.data.status === "success") {
      return NextResponse.json({ status: true, data: verifyData.data });
    } else {
      return NextResponse.json({ status: false, data: verifyData.data });
    }
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
