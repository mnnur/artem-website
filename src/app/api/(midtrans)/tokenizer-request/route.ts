import { authOptions } from "@/app/lib/auth";
import { generateTokenMidtransRequest } from "@/app/lib/token-generate/midtrans-request/midtrans-generate-token-request";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { requestId, transactionId } = await request.json();
  console.log(requestId);
  const session = await getServerSession(authOptions);

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const token = await generateTokenMidtransRequest(requestId, transactionId);

    const data = {
      requestId: requestId,
    };

    if (token.status !== 200) {
      return NextResponse.json({ status: token.status, message: "Failed to generate token", data: token.message, orderId: data });
    }

    return NextResponse.json({ status: token.status, message: token.message, data: token.data, orderId: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Something went wrong!" });
  }
}
