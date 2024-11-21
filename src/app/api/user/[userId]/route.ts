import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app//lib/auth";
import { db } from "@/app/lib/db";

async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  } finally {
    await db.$disconnect();
  }
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  if (!params.userId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing user ID in the request URL",
    });
  }

  try {
    const user = await getUserById(params.userId);

    if (user) {
      return NextResponse.json({
        data: user,
        code: 200,
        error: false,
        message: "User found successfully",
      });
    } else {
      return NextResponse.json({
        code: 404,
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}

async function editUser(userId: string, newUserData: any) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: newUserData,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  } finally {
    await db.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  if (!params.userId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing user ID in the request URL",
    });
  }

  const session = await getServerSession(authOptions);

  // Check if a valid session exists (user is authenticated)
  if (!session?.user) {
    return NextResponse.json({
      code: 401,
      error: true,
      message: "Unauthorized access. Please sign in",
    });
  }

  try {
    const requestBody = await request.json();
    console.log(requestBody);

    const updatedUser = await editUser(params.userId, requestBody);

    if (updatedUser) {
      return NextResponse.json({
        data: updatedUser,
        code: 200,
        error: false,
        message: "User edited successfully",
      });
    } else {
      // Handle case where user wasn't found during update
      return NextResponse.json({
        code: 404,
        error: true,
        message: "User not found or update failed",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await db.$disconnect();
  }
}

async function deleteUser(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("User not found:", error);
      throw new Error("User not found");
    } else {
      console.error("Error deleting user:", error);
      throw error;
    }
  } finally {
    await db.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  if (!params.userId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing user ID in the request URL",
    });
  }

  const session = await getServerSession(authOptions);

  // Check if a valid session exists (user is authenticated)
  if (!session?.user) {
    return NextResponse.json({
      code: 401,
      error: true,
      message: "Unauthorized access. Please sign in",
    });
  }

  try {
    await deleteUser(params.userId);

    return NextResponse.json({
      code: 200,
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2005") {
        return NextResponse.json({
          code: 404,
          error: true,
          message: "User not found",
        });
      }
    } else {
      console.error("Error deleting user:", error);
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
