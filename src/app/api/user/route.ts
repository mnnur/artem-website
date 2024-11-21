import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/app/lib/prisma";
import { getUserByEmail } from "@/app/features/user";
import { RegisterSchema } from "@/app/form_schema";
import { generateVerificationToken } from "@/app/lib/token-generate/email-verification-token";
import { sendVerificationEmail } from "@/app/lib/email";

async function getAllUsers() {
  // Corrected function name (plural)
  try {
    const users = await db.user.findMany(); // Use findMany for retrieval
    return users; // Return the retrieved users directly
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users"); // Re-throw for proper error handling
  } finally {
    await db.$disconnect();
  }
}

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({
      data: users,
      code: 200,
      error: false,
      message: "Success",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Error fetching users",
    });
  } finally {
    await db.$disconnect();
  }
}

async function createUser(userData: any) {
  try {
    const user = await db.user.create({
      data: {
        ...userData,
      },
    });

    const verificationToken = await generateVerificationToken(userData.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    console.log(`User created with ID: ${user.id}`);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await db.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const validatedFields = RegisterSchema.safeParse(requestBody);

    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.errors
        .map((error, index, array) => {
          if (index === array.length - 1) {
            return `${error.message}!`;
          }

          return error.message;
        })
        .join("! ");

      return NextResponse.json({ status: 500, message: errorMessage });
    }

    if (!requestBody.name || !requestBody.email || !requestBody.phoneNumber || !requestBody.address) {
      return NextResponse.json({ error: "Missing required fields" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(requestBody.password, saltRounds);
    console.log(requestBody.email);

    const existingUser = await getUserByEmail(requestBody.email);
    console.log(existingUser);

    if (existingUser) {
      return NextResponse.json({ code: 401, message: "Email has already taken" });
    } else {
      const mergedUserData = {
        ...requestBody,
        password: hashedPassword,
      };

      await createUser(mergedUserData);

      return NextResponse.json({
        code: 200,
        error: false,
        message: "Confirmation email sent!",
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Error creating user",
    });
  } finally {
    await db.$disconnect();
  }
}
