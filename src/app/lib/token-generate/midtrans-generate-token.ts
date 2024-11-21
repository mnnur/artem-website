"use server";

import { NextResponse } from "next/server";
import { ObjectId } from "bson";
import { getServerSession } from "next-auth";
import { noAuthorizeResponse } from "@/utils/noAuthorizeMessage";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";

export const generateTokenMidtrans = async (orderIds: string[]) => {
  const secret = process.env.SERVER_KEY;
  const auth_string = Buffer.from(secret!).toString("base64");
  const authorization = `Basic ${auth_string}`;
  const transaction_id = new ObjectId().toHexString();

  const session = await getServerSession(authOptions);

  const isNotAuthorized = !session?.admin && !session?.user && !session?.token;

  if (isNotAuthorized) return noAuthorizeResponse;

  const orders = await db.order.findMany({
    where: {
      id: { in: orderIds },
      // userId: customerId,
      status: "PENDING",
    },
    include: {
      products: true,
      user: true,
    },
  });

  if (!orders || orderIds.length === 0) {
    return NextResponse.json({ status: 400, message: "No items selected for checkout" });
  }

  const grossAmount = orders.reduce((total, order) => {
    return total + order.total_price;
  }, 0);

  const itemDetails = orders.flatMap((order) => ({
    id: order.products.id,
    price: order.products.price,
    quantity: order.quantity,
    name: order.products.name,
  }));

  const customerDetails = {
    first_name: orders[0].user.name,
    last_name: "",
    email: orders[0].user.email,
    phone: orders[0].user.phoneNumber,
  };

  let parameter = {
    transaction_details: {
      order_id: transaction_id,
      gross_amount: grossAmount,
    },
    item_details: itemDetails,
    customer_details: customerDetails,
  };

  const response = await fetch(`${process.env.MIDTRANS_URL}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify(parameter),
  });

  const data = await response.json();

  if (response.status !== 201) {
    console.log("Failed to create transaction");

    return NextResponse.json({ status: 500, message: "Failed to create transaction!" });
  }

  try {
    await db.transaction.create({
      data: {
        id: transaction_id,
        date: new Date(Date.now()),
        price: grossAmount,
        user: {
          connect: {
            id: orders[0].userId,
          },
        },
        orders: {
          connect: orderIds.map((id) => ({ id })),
        },
      },
    });

    await db.order.updateMany({
      where: {
        id: {
          in: orderIds,
        },
      },
      data: {
        transactionId: transaction_id,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, message: "Failed to save transaction!" });
  }

  return data;
};
