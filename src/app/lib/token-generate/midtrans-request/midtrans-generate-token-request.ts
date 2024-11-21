"use server";

import { db } from "@/app/lib/db";

export const generateTokenMidtransRequest = async (requestId: string, transactionId: string) => {
  const secret = process.env.SERVER_KEY;
  const auth_string = Buffer.from(secret!).toString("base64");
  const authorization = `Basic ${auth_string}`;

  if (!requestId || !transactionId) {
    return { status: 404, message: "Missing request ID / transaction ID" };
  }

  const request = await db.request.findFirst({
    where: {
      id: requestId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          address: true,
        },
      },
    },
  });

  const total_price = request?.total_price;
  console.log(total_price);

  if (!total_price) {
    return { status: 400, message: "Total price is not calculated" };
  }

  if (!request || requestId.length === 0) {
    return { status: 400, message: "No items selected for checkout" };
  }

  const grossAmount = total_price * request.quantity;

  const itemDetails = {
    id: request.id,
    price: total_price,
    quantity: request.quantity,
    name: request.request_name,
  };

  const user = request.user;

  const customerDetails = {
    first_name: user.name,
    last_name: "",
    email: user.email,
    phone: user.phoneNumber,
    address: user.address,
  };

  let parameter = {
    transaction_details: {
      order_id: transactionId,
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

    return { status: 500, message: "Failed to create transaction!" };
  }

  try {
    await db.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        date: new Date(Date.now()),
        price: grossAmount,
        status: "PAYMENT_PENDING",
        user: {
          connect: {
            id: user.id,
          },
        },
        requests: {
          connect: {
            id: requestId,
          },
        },
      },
    });

    await db.request.update({
      where: {
        id: requestId,
      },
      data: {
        status: "PAYMENT_PENDING",
      },
    });

    return { status: 200, message: "Token successfully generated", data: data };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Failed to save transaction!" };
  }
};
