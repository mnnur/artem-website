"use server";

import { MidtransAfterPaymentProps } from "@/interface/MidtransAfterPaymentProps";
import { db } from "./db";
import { createHash } from "crypto";
import { Status } from "@prisma/client";

const updateTransactionDb = async (response: MidtransAfterPaymentProps, status: Status) => {
  const transactionId = response.order_id;
  try {
    await db.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: status,
        date: new Date(Date.now()),
        noResi: response.transaction_id,
      },
    });

    const order = await db.order.findMany({
      where: {
        transactionId: transactionId,
      },
    });

    if (order) {
      await db.order.updateMany({
        where: {
          transactionId: transactionId,
        },
        data: {
          status: status,
        },
      });
    }

    const request = await db.request.findFirst({
      where: {
        transactionId: transactionId,
      },
    });

    if (request) {
      await db.request.update({
        where: {
          id: request.id,
        },
        data: {
          status: status,
        },
      });
    }

    return { status: 200, message: "Transaction completed" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Failed to update transaction" };
  }
};

const signatureKeyCompare = (signature_key: string, order_id: string, gross_amount: string, status_code: string) => {
  const userSignatureKey = `${order_id}${status_code}${gross_amount}${process.env.SERVER_KEY}`;

  const hash = createHash("sha512").update(userSignatureKey).digest("hex");
  console.log(hash);
  console.log(signature_key);

  return hash === signature_key;
};

export const handleAfterPayment = async (response: MidtransAfterPaymentProps) => {
  const transactionStatus = response.transaction_status;
  const fraudStatus = response.fraud_status;
  let data = null;
  const transaction = await db.transaction.findFirst({
    where: {
      id: response.order_id,
    },
  });

  if (!transaction?.id || !transaction?.price) {
    return { status: 501, message: "Transaction not found" };
  }

  const isSignatureKeyFromMidtrans = signatureKeyCompare(response.signature_key, transaction?.id, response.gross_amount, response.status_code);

  if (isSignatureKeyFromMidtrans) {
    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept") {
        data = await updateTransactionDb(response, "DONE");
      } else return { status: 500, message: "Fraud detected!" };
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      data = await updateTransactionDb(response, "CANCELED");
    } else if (transactionStatus === "pending") {
      data = await updateTransactionDb(response, "PENDING");
    } else {
      return { status: 500, message: "no status available" };
    }
  } else {
    return { status: 500, message: "Invalid signature key!" };
  }

  return data;
};
