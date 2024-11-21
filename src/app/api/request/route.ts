import { NextRequest, NextResponse } from "next/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { Prisma, Status } from "@prisma/client";

async function getAllRequests(userId: string) {
  const statusShow: Status[] = ["ACCEPTED", "PENDING", "PAYMENT_PENDING"].map((status) => status as Status);
  try {
    const requests = await db.request.findMany({
      where: {
        userId: userId,
        status: {
          in: statusShow,
        },
      },
    });
    return requests;
  } catch (error) {
    // Check for Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error fetching requests:", error.code, error.message);
      return NextResponse.json({
        code: 500,
        error: true,
        message: `Error fetching requests: ${error.code}`, // Use Prisma error code
      });
    } else {
      console.error("Unknown error fetching requests:", error);
      return NextResponse.json({
        code: 500,
        error: true,
        message: "Error fetching requests",
      });
    }
  } finally {
    await db.$disconnect();
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  // 666ff2d04db83932ecdb23d3

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);
  if (!userId) return NextResponse.json({ code: 401, message: "Invalid user ID!" });

  try {
    const requests = await getAllRequests(userId);
    return NextResponse.json({
      data: requests,
      code: 200,
      error: false,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Error fetching requests",
    });
  } finally {
    await db.$disconnect();
  }
}

async function createRequest(requestData: FormData, userId: string) {
  const requestBody = requestData.get("data");
  const file = requestData.get("image");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ status: 400, message: "Invalid file" });
  }

  try {
    const body = JSON.parse(requestBody as string);
    const fileName = `request_image/${Date.now()}_${file.name}`;
    const urlRef = ref(storage, fileName);
    const uploadFile = await uploadBytes(urlRef, file);
    const url = await getDownloadURL(uploadFile.ref);

    body.image = url;

    const request = await db.request.create({
      data: {
        request_name: body.request_name,
        description: body.description,
        design_user: body.image,
        product_needed_time: body.product_needed_time,
        category: body.category,
        quantity: parseInt(body.quantity),
        size: body.size,
        color: body.color,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await db.transaction.create({
      data: {
        date: new Date(Date.now()),
        user: {
          connect: {
            id: userId,
          },
        },
        requests: {
          connect: {
            id: request.id,
          },
        },
      },
    });

    return NextResponse.json({ status: 200, message: "Request created successfully" });
  } catch (error) {
    // Check for Prisma specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      let errorMessage = "Error creating request";
      switch (error.code) {
        case "P2002":
          errorMessage = "Request already exists";
          break;
      }
      return NextResponse.json({
        code: 500,
        error: true,
        message: errorMessage,
      });
    } else {
      console.error("Unknown error creating request:", error);
      return NextResponse.json({
        code: 500,
        error: true,
        message: "Error creating request",
      });
    }
  } finally {
    await db.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;
  // 666ff2d04db83932ecdb23d3
  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return NextResponse.json(noAuthorizeResponse);

  if (!userId) {
    return NextResponse.json({ status: 404, message: "Invalid user!" });
  }

  try {
    const requestBody = await request.formData();
    const requiredFields = ["data", "image"];
    const missingFields = requiredFields.filter((field) => !requestBody.has(field));

    if (missingFields.length > 0) {
      return NextResponse.json({
        code: 400,
        error: true,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    await createRequest(requestBody, userId);
    return NextResponse.json({
      code: 200,
      error: false,
      message: "Success",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
      error: true,
      message: "Error processing request",
    });
  } finally {
    await db.$disconnect();
  }
}
