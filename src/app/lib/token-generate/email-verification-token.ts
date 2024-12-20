import { getVerificationTokenByEmail } from "@/app/features/verification-token";
import { uuidv7 } from "uuidv7";
import { db } from "../db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv7();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
