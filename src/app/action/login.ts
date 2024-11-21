"use server";

import { getAdminByEmail, getUserByEmail } from "@/app/features/user";
import { generateVerificationToken } from "@/app/lib/token-generate/email-verification-token";
import { sendVerificationEmail } from "@/app/lib/email";

export const loginAction = async (email: string) => {
  const existingUser = await getUserByEmail(email);
  console.log("MASUK KE SINI YA");

  if (existingUser) {
    if (!existingUser.emailVerified || !existingUser.emailVerifiedAt) {
      const verificationToken = await generateVerificationToken(existingUser.email);
      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { error: false, message: "Confirmation email sent!", data: verificationToken };
    }
  }

  return { error: false, message: "User authenticated successfully" };
};
