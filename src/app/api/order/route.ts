import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const userId = session!.user.id;

  const { quantity, total_price, productsId, color, size } = await request.json();

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    await prisma.order.create({
      data: {
        quantity: quantity,
        total_price: total_price,
        user: {
          connect: {
            id: userId,
          },
        },
        products: {
          connect: {
            id: productsId,
          },
        },
        color: color,
        size: size,
      },
    });
    console.log("Hello baby");

    return NextResponse.json({ code: 201, message: "success" });
  } catch (err) {
    console.log("Hello babi");
    console.log(err);

    return NextResponse.json({ code: 501, message: "Failed create data" });
  } finally {
    prisma.$disconnect;
  }
}
