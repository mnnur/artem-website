import { getHistoryById } from "@/app/features/history";
import { authOptions } from "@/app/lib/auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { historyId: string } }) {
  const session = await getServerSession(authOptions);
  const { historyId } = params;

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  try {
    const historyTransaction = await getHistoryById(historyId);
    const dataOrder = historyTransaction.dataOrder;
    const dataRequest = historyTransaction.dataRequest;

    return NextResponse.json({ code: 200, message: "Data found successfully", dataOrder, dataRequest });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: 500, message: "Internal server error" });
  }
}
