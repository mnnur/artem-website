import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";

const prisma = new PrismaClient();

async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Error fetching product");
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  if (!params.productId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing product ID in the request URL",
    });
  }

  try {
    const user = await getProductById(params.productId);

    if (user) {
      return NextResponse.json({
        data: user,
        code: 200,
        error: false,
        message: "Product found successfully",
      });
    } else {
      return NextResponse.json({
        code: 404,
        error: true,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Internal server error",
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function editProduct(productId: string, newProductData: any) {
  const requestBody = newProductData.get("data");
  const file = newProductData.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ status: 400, message: "Invalid file" });
  }
  try {
    const body = JSON.parse(requestBody);
    const fileName = `product_image/${productId}_${file.name}`;
    const urlRef = ref(storage, fileName);
    const uploadFile = await uploadBytes(urlRef, file);
    const url = await getDownloadURL(uploadFile.ref);

    body.image = url;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: body
    });
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { productId: string } }) {
  if (!params.productId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing product ID in the request URL",
    });
  }

  try {
    const requestBody = await request.formData();
    const updatedUser = await editProduct(params.productId, requestBody);

    if (updatedUser) {
      return NextResponse.json({
        data: updatedUser,
        code: 200,
        error: false,
        message: "Product edited successfully",
      });
    } else {
      // Handle case where user wasn't found during update
      return NextResponse.json({
        code: 404,
        error: true,
        message: "Product not found or update failed",
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
    await prisma.$disconnect();
  }
}

async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("product not found:", error);
      throw new Error("product not found"); // Re-throw with a clear message
    } else {
      console.error("Error deleting product:", error);
      throw error; // Re-throw other errors
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  if (!params.productId) {
    return NextResponse.json({
      code: 400,
      error: true,
      message: "Missing product ID in the request URL",
    });
  }

  try {
    await deleteProduct(params.productId);

    return NextResponse.json({
      code: 200,
      error: false,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2005") {
        return NextResponse.json({
          code: 404,
          error: true,
          message: "Product not found",
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
    await prisma.$disconnect();
  }
}
