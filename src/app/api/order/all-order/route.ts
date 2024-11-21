import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const dataOrders = await prisma.order.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      include: {
        products: {
          select: {
            image: true,
            name: true,
            price: true,
          },
        },
      },
    });

    const responseData = {
      status: 200,
      message: "Data found yes",
      data: dataOrders,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      status: 500,
      message: "Failed to load data",
    });
  } finally {
    prisma.$disconnect();
  }
}
