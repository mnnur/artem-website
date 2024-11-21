import { NextRequest, NextResponse } from "next/server";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { db } from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export async function PATCH(request: NextRequest) {
  const data = await request.json();
  const id = data.id;
  const status = data.status;
  const session = await getServerSession(authOptions);

  if (!id) return NextResponse.json({ status: 401, message: "Invalid request ID" });
  if (!status) return NextResponse.json({ status: 401, message: "Status must be known" });

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const transaction = await db.request.findFirst({
      where: {
        id,
      },
      select: {
        transactionId: true,
      },
    });

    const transactionId = transaction?.transactionId;

    if (!transactionId) {
      return NextResponse.json({ status: 404, message: "No request found!" });
    }
    await db.request.update({
      where: {
        id,
      },
      data: {
        status: status || "CANCELED",
        transaction: {
          update: {
            where: { id: transactionId },
            data: {
              status: status || "CANCELED",
            },
          },
        },
      },
    });

    return NextResponse.json({ status: 200, message: "Request canceled successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}
