import { sendEmail } from '../../../../utils/email';
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

const crypto = require('node:crypto');
const prisma = new PrismaClient()

async function editUser(userId: string, newUserData: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: newUserData,
      });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Error updating user");
    } finally {
      await prisma.$disconnect();
    }
  }

  function randomToken() {
    return crypto.randomBytes(64).toString('hex');;
  }

  export async function POST() {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session?.user) {
        return NextResponse.json({
          code: 401,
          error: true,
          message: "Unauthorized access. Please sign in",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id},
      });

      if (user?.verified) {
        return NextResponse.json({
          code: 400,
          error: true,
          message: "Already verified",
        });
      }
  
      const token = await randomToken();
  
      const updatedUser = await editUser(session.user.id, {
        token: token,

      });
  
      if (!updatedUser) {
        throw new Error("Failed to update user with verification token");
      }
  
      const email = sendEmail(
        session.user.email,
        "Email Verification",
        `here is yout verification link:\n` + process.env.NEXT_PUBLIC_BASE_URL + "/api/user/verification?token="  + token
      );
  
      return NextResponse.json({
        code: 200,
        error: false,
        message: "Verification email sent",
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({
        code: 500,
        error: true,
        message: "Error sending vertification email",
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  export async function GET(request: NextRequest) {
    try {
      const url = new URL(request.url);
      const urlParams = url.searchParams;
      const tokenParam = urlParams.get("token");
      const session = await getServerSession(authOptions);
  
      if (!session?.user) {
        return NextResponse.json({
          code: 401,
          error: true,
          message: "Unauthorized access. Please sign in",
        });
      }
  
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
  
      if (!user) {
        return NextResponse.json({
          code: 404,
          error: true,
          message: "User not found",
        });
      }

      if (user?.verified) {
        return NextResponse.json({
          code: 400,
          error: true,
          message: "Already verified",
        });
      }
  
      if (user.token !== tokenParam) {
        return NextResponse.json({
          code: 400,
          error: true,
          message: "Invalid verification token",
        });
      }
  
      const updatedUser = await editUser(session.user.id, {
        verified: true,
        token: null, // Remove token after verification
      });
  
      if (!updatedUser) {
        throw new Error("Failed to update user with verification token");
      }
  
      return NextResponse.redirect(new URL('/', request.url));

    } catch (e) {
      console.error(e);
      return NextResponse.json({
        code: 500,
        error: true,
        message: "Error verifying email",
      });
    } finally {
      await prisma.$disconnect();
    }
  }