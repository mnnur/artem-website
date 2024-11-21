import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { simplifiedOrderHistory, simplifiedRequestHistory } from "@/utils/history-utils";

export async function GET() {
  const session = await getServerSession(authOptions);

  const isNotAuthorized = !session?.admin && !session?.token;
  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const requestHistory = await db.request.findMany({
      select: {
        id: true,
        status: true,
        color: true,
        size: true,
        category: true,
        request_name: true,
        design_user: true,
        quantity: true,
        design_admin: true,
        total_price: true,
        date: true,
        description: true,
        user: {
          select: {
            name: true,
            email: true,
            address: true,
            phoneNumber: true,
          },
        },
      },
    });

    const orderHistory = await db.order.findMany({
      select: {
        id: true,
        status: true,
        total_price: true,
        date: true,
        color: true,
        size: true,
        quantity: true,
        products: {
          select: {
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });

    const dataOrder = orderHistory;
    const dataRequest = requestHistory;

    return NextResponse.json({ status: 200, message: "Data found", dataOrder, dataRequest });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Internal server error!" });
  }
}
