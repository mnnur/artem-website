import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";

async function getRequestById(requestId: string) {
  try {
    const productRequest = await db.request.findUnique({
      where: {
        id: requestId,
      },
    });
    return productRequest;
  } catch (error) {
    console.error("Error fetching request:", error);
    throw new Error("Error fetching request");
  } finally {
    await db.$disconnect();
  }
}

export async function GET(req: NextRequest, { params }: { params: { requestId: string } }) {
  const session = await getServerSession(authOptions);
  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  if (!params.requestId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing request ID in the request URL",
    });
  }

  try {
    const productRequest = await getRequestById(params.requestId);

    if (productRequest) {
      return NextResponse.json({
        data: productRequest,
        code: 200,
        error: false,
        message: "Request found successfully",
      });
    } else {
      return NextResponse.json({
        code: 404,
        error: true,
        message: "Request not found",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}

async function editRequest(requestId: string, newRequestData: any) {
  try {
    const updatedRequest = await db.request.update({
      where: { id: requestId },
      data: newRequestData,
    });
    return updatedRequest;
  } catch (error) {
    console.error("Error updating request:", error);
    throw new Error("Error updating request");
  } finally {
    await db.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { requestId: string } }) {
  if (!params.requestId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing request ID in the request URL",
    });
  }

  try {
    const requestBody = await request.json();
    const updatedRequest = await editRequest(params.requestId, requestBody);

    if (updatedRequest) {
      return NextResponse.json({
        data: updatedRequest,
        code: 200,
        error: false,
        message: "Request edited successfully",
      });
    } else {
      return NextResponse.json({
        code: 404,
        error: true,
        message: "Request not found or update failed",
      });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}

async function deleteRequest(requestId: string) {
  try {
    await db.request.delete({
      where: { id: requestId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Request not found:", error);
      throw new Error("Request not found");
    } else {
      console.error("Error deleting request:", error);
      throw error;
    }
  } finally {
    await db.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { requestId: string } }) {
  if (!params.requestId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing request ID in the request URL",
    });
  }

  try {
    await deleteRequest(params.requestId);

    return NextResponse.json({
      code: 200,
      error: false,
      message: "Request deleted successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2005") {
        return NextResponse.json({
          code: 404,
          error: true,
          message: "Request not found",
        });
      }
    } else {
      console.error("Error deleting request:", error);
      return NextResponse.json({
        code: 500,
        error: true,
        message: "Internal server error",
      });
    }
  } finally {
    await db.$disconnect();
  }
}
