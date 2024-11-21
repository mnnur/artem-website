import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { simplifiedOrderHistory, simplifiedRequestHistory } from "@/utils/history-utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  //666b15c121c48a1a2211d418

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const requestHistory = await db.transaction.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        price: true,
        date: true,
        requests: {
          select: {
            id: true, // Ensure this is the correct field name
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
          },
        },
      },
    });

    const orderHistory = await db.transaction.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        price: true,
        status: true,
        date: true,
        orders: {
          select: {
            color: true,
            size: true,
            quantity: true,
            products: {
              select: {
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    const rawDataOrder = simplifiedOrderHistory(orderHistory);
    const filteredOrder = rawDataOrder.filter((order) => order.orders.length > 0);
    const dataOrder = filteredOrder;
    const dataRequest = simplifiedRequestHistory(requestHistory);

    return NextResponse.json({ status: 200, message: "Data found", dataOrder, dataRequest });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ status: 500, message: "Something went wrong!" });
  }
}

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const { id } = params;
//   const session = await getServerSession(authOptions);
//   const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

//   if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);
// }
