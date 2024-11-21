import { generateTokenMidtrans } from "@/app/lib/token-generate/midtrans-generate-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { orderIds } = await request.json();
  console.log(orderIds);

  try {
    const token = await generateTokenMidtrans(orderIds);

    const data = {
      orderIds: orderIds,
    };

    return NextResponse.json({ status: 200, message: "Got the token!", data: token, orderId: data });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ status: 500, message: "Something went wrong!" });
  }
}
