import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// Create a new user in the database
async function createAdmin(adminData: any) {
  try {
    const admin = await db.admin.create({
      data: {
        ...adminData,
      },
    });
    console.log(`Admin created with ID: ${admin.id}`);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await db.$disconnect();
  }
}

async function getAdminByEmail(email: string) {
  try {
    const admin = await db.admin.findUnique({
      where: {
        email: email,
      },
    });
    return admin;
  } catch (error) {
    console.error("Error fetching admin by email:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    if (!requestBody.name || !requestBody.email || !requestBody.phoneNumber || !requestBody.password) {
      return NextResponse.json({ error: "Missing required fields" });
    }

    // Hash the password before creating the user
    const saltRounds = 10; // Adjust this value based on security requirements
    const hashedPassword = await bcrypt.hash(requestBody.password, saltRounds);

    const existingUser = await getAdminByEmail(requestBody.email);

    if (existingUser) {
      return NextResponse.json({ code: 401, message: "Email has already taken" });
    } else {
      const userData = {
        name: requestBody.name,
        email: requestBody.email,
        phoneNumber: requestBody.phoneNumber,
        password: hashedPassword,
      };

      await createAdmin(userData);

      return NextResponse.json({
        code: 200,
        error: false,
        message: "Success",
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
