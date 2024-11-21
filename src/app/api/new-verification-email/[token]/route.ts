import { getUserByEmail } from "@/app/features/user";
import { getVerificationTokenByToken } from "@/app/features/verification-token";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const token = params.token;

  if (!token) {
    return NextResponse.json({ status: 404, message: "Token is missing!" });
  }

  const existingToken = await getVerificationTokenByToken(token);

  try {
    //check if token exist in database
    if (!existingToken) {
      return NextResponse.json({ status: 404, message: "Token does not exist!" });
    }
    //check if token has expired
    const expired = new Date(existingToken.expires) < new Date();
    if (expired) {
      return NextResponse.json({ status: 401, message: "Token has expired. Please send the verification email again!" });
    }
    //check if there's user that linked to the token
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return NextResponse.json({ status: 404, message: "No user linked with the email!" });
    }

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        tokenVerify: token,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return NextResponse.json({ status: 200, message: "Email verified successfully!" });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Failed to verify email!" });
  }
}
