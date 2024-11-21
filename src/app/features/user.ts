import { db } from "@/app/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getAdminByEmail = async (email: string) => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        email,
      },
    });
    return admin;
  } catch {
    return null;
  }
};

export const getUserByID = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getAdminByID = async (id: string) => {
  try {
    const admin = await db.admin.findUnique({
      where: {
        id,
      },
    });
    return admin;
  } catch {
    return null;
  }
};
