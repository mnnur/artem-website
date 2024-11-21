import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { db } from "@/app/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  const isNotAuthorized = !session?.admin && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const dataRequests = await db.request.findMany({
      where: {
        status: "PENDING",
      },
      include: {
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

    const responseData = {
      status: 200,
      message: "Data found yes",
      data: dataRequests,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      status: 500,
      message: "Failed to load data",
    });
  } finally {
    db.$disconnect();
  }
}
