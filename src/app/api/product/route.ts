import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

async function getAllProducts(query: string = "", filter: string = "", sort: string = "", sortOrder: string = "", size: number = 10, page: number = 1) {
  try {
    const whereClause = query ? { OR: [{ name: { contains: query } }, { category: { contains: filter } }] } : {};
    const sortOrderClause = sortOrder === "desc" ? "desc" : "asc";
    const products = await prisma.product.findMany({
      where: whereClause,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        [sort || "price"]: sortOrderClause,
      },
      select: {
        id: true,
        author: true,
        name: true,
        category: true,
        model: true,
        description: true,
        image: true,
        price: true,
        rating: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
          },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products");
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log(session);

  try {
    const url = new URL(request.url);
    const urlParams = url.searchParams;
    const query = urlParams.get("query");
    const filter = urlParams.get("filter");
    const sort = urlParams.get("sort");
    const sortOrder = urlParams.get("sortOrder");
    const size = urlParams.get("size");
    const page = urlParams.get("page");
    const products = await getAllProducts(query || "", filter || "", sort || "", sortOrder || "", Number(size) || 10, Number(page) || 1);
    return NextResponse.json({
      data: products,
      code: products.length > 0 ? 200 : 204, // Set code to 204 (No Content) if no data found
      error: false,
      message: products.length > 0 ? "Success" : "No products found",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Error fetching products",
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function createProduct(productData: any) {
  const requestBody = productData.get("data");
  const file = productData.get("image");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ status: 400, message: "Invalid file" });
  }

  try {
    const body = JSON.parse(requestBody);
    const fileName = `product_image/${Date.now()}_${file.name}`;
    const urlRef = ref(storage, fileName);
    const uploadFile = await uploadBytes(urlRef, file);
    const url = await getDownloadURL(uploadFile.ref);

    body.image = url;

    const product = await prisma.product.create({
      data: body,
    });
    console.log(`Product created with ID: ${product.id}`);
    console.log(product);
  } catch (error) {
    console.error("Error creating Product:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.formData();

    // Check for required fields
    const requiredFields = ["data", "image"];
    const missingFields = requiredFields.filter((field) => !requestBody.has(field));

    if (missingFields.length > 0) {
      console.log(missingFields);

      return NextResponse.json({
        code: 400, // Bad Request
        error: true,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    await createProduct(requestBody);

    return NextResponse.json({
      code: 200,
      error: false,
      message: "Success",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      code: 500,
      error: true,
      message: "Error creating product",
    });
  } finally {
    await prisma.$disconnect();
  }
}
