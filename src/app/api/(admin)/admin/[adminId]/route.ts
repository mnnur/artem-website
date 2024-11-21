import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function getAdminById(adminId: string) {
  try {
    const admin = await db.admin.findUnique({
      where: {
        id: adminId,
      },
    });
    return admin;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw new Error("Error fetching admins");
  } finally {
    await db.$disconnect();
  }
}

export async function GET(req: NextRequest, { params }: { params: { adminId: string } }) {
  if (!params.adminId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing admin ID in the request URL",
    });
  }

  try {
    const admin = await getAdminById(params.adminId);

    if (admin) {
      return NextResponse.json({
        data: admin,
        code: 200,
        error: false,
        message: "Admin found successfully",
      });
    } else {
      return NextResponse.json({
        code: 404,
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}

async function editAdmin(adminId: string, newAdminData: any) {
  try {
    const updatedAdmin = await db.admin.update({
      where: { id: adminId },
      data: newAdminData,
    });
    return updatedAdmin;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw new Error("Error updating admin");
  } finally {
    await db.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { adminId: string } }) {
  if (!params.adminId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing admin ID in the request URL",
    });
  }

  const session = await getServerSession(authOptions);

  // Check if a valid session exists (user is authenticated)
  if (!session?.admin) {
    return NextResponse.json({
      code: 401,
      error: true,
      message: "Unauthorized access. Please sign in",
    });
  }

  try {
    const requestBody = await request.json();
    console.log(requestBody);

    const updatedUser = await editAdmin(params.adminId, requestBody);

    if (updatedUser) {
      return NextResponse.json({
        code: 200,
        error: false,
        message: "User edited successfully",
      });
    } else {
      // Handle case where admin wasn't found during update
      return NextResponse.json({
        code: 404,
        error: true,
        message: "User not found or update failed",
      });
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}
