import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { authOptions } from "@/app/lib/auth";
import { updateRequestUser } from "@/app/features/request";

export async function GET(request: NextRequest, { params }: { params: { requestId: string } }) {
  const session = await getServerSession(authOptions);
  const { requestId } = params;

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);
  if (!requestId) return NextResponse.json({ code: 401, message: "Invalid request ID!" });

  try {
    const dataRequest = await db.request.findFirst({
      where: {
        id: requestId,
      },
    });

    if (!dataRequest) {
      return NextResponse.json({ status: 404, message: "Data not found" });
    }

    return NextResponse.json({ status: 200, message: "Data found", dataRequest });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { requestId: string } }) {
  const session = await getServerSession(authOptions);
  const { requestId } = params;
  const requestBody = await request.formData();
  const files: File[] = [];
  const dataField = requestBody.get("data");

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);
  if (!requestId) return NextResponse.json({ code: 401, message: "Invalid request ID!" });

  if (!dataField) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing required fields: 'data'}",
    });
  }

  const body = JSON.parse(dataField as string);

  requestBody.forEach((value, key) => {
    if (key.startsWith("image_") && value instanceof File) {
      files.push(value);
    }
  });

  if (body.status === "ACCEPTED") {
    if (files.length === 0) {
      return NextResponse.json({
        code: 400,
        error: true,
        message: "No image files attached}",
      });
    }
  }

  try {
    const requestData = await updateRequestUser(body, files, requestId);

    return NextResponse.json(requestData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Internal server error" });
  }
}
