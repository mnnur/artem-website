import { handleAfterPayment } from "@/app/lib/handle-after-payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = await handleAfterPayment(body);
  console.log(data);

  return NextResponse.json({ status: 201, message: "Transaction success", data: data });
}
