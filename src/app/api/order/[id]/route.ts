import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  const { date, quantity, total_price, status, userId, transactionId, productsId } = await request.json();

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        date: date,
        quantity: quantity,
        total_price: total_price,
        status: status,
        user: {
          connect: {
            id: userId,
          },
        },
        transaction: {
          connect: {
            id: transactionId,
          },
        },
        products: {
          connect: productsId.map((productId: string) => ({
            id: productId,
          })),
        },
      },
    });

    return NextResponse.json({ status: 201, message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Failed to update" });
  } finally {
    prisma.$disconnect();
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: id,
      },
      include: {
        user: true,
        products: true,
        transaction: true,
      },
    });

    if (!order) {
      return NextResponse.json({ status: 400, message: "Order not found" });
    }

    return NextResponse.json({ status: 200, message: "Data found", order });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Failed to load data" });
  } finally {
    prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const session = await getServerSession(authOptions);

  if (!id) {
    return NextResponse.json({ status: 404, message: "Missing ID!" });
  }

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    await prisma.order.delete({
      where: {
        id: id,
      },
    });

    console.log("Order deleted");

    return NextResponse.json({ status: 201, message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Failed to delete" });
  } finally {
    prisma.$disconnect();
  }
}
