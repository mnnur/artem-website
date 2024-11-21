import { db } from "@/app/lib/db";
import { singleSimplifiedOrderHistory, singleSimplifiedRequestHistory } from "@/utils/history-utils";

export const getHistoryById = async (historyId: string) => {
  const requestHistory = await db.transaction.findFirst({
    where: {
      id: historyId,
    },
    select: {
      id: true,
      price: true,
      status: true,
      date: true,
      requests: {
        select: {
          id: true,
          request_name: true,
          status: true,
          design_user: true,
          quantity: true,
          design_admin: true,
          color: true,
          size: true,
        },
      },
    },
  });

  const orderHistory = await db.transaction.findFirst({
    where: {
      id: historyId,
    },
    select: {
      id: true,
      price: true,
      status: true,
      date: true,
      orders: {
        select: {
          color: true,
          size: true,
          quantity: true,
          products: {
            select: {
              name: true,
              image: true,
              price: true,
            },
          },
        },
      },
    },
  });

  const dataOrder = orderHistory && orderHistory.orders && orderHistory.orders.length > 0 ? singleSimplifiedOrderHistory(orderHistory) : {};
  const dataRequest = requestHistory ? singleSimplifiedRequestHistory(requestHistory) : [];

  return { dataOrder, dataRequest };
};
