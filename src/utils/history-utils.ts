export const simplifiedOrderHistory = (orderHistory: Transaction[]): SimplifiedTransaction[] => {
  return orderHistory.map((transaction) => {
    const simplifiedOrders = transaction.orders.map((order) => ({
      name: order.products.name,
      image: order.products.image,
      quantity: order.quantity,
      color: order.color,
      size: order.size,
      price: order.products.price,
    }));

    return {
      id: transaction.id,
      price: transaction.price,
      status: transaction.status,
      date: transaction.date,
      orders: simplifiedOrders,
    };
  });
};

export const simplifiedRequestHistory = (requestHistory: TransactionRequest[]): SimplifiedRequest[] => {
  return requestHistory.flatMap((transaction) => {
    return transaction.requests.map((request) => ({
      id: transaction.id,
      requestId: request.id,
      price: transaction.price ?? 0,
      status: request.status,
      date: transaction.date,
      quantity: request.quantity,
      color: request.color,
      size: request.size,
      request_name: request.request_name,
      design_user: request.design_user,
      design_admin: request.design_admin,
    }));
  });
};

export const singleSimplifiedOrderHistory = (orderHistory: Transaction): SimplifiedTransaction | null => {
  if (!orderHistory) return null;

  const simplifiedOrders = orderHistory.orders.map((order) => ({
    name: order.products.name,
    image: order.products.image,
    quantity: order.quantity,
    color: order.color,
    size: order.size,
    price: order.products.price,
  }));

  return {
    id: orderHistory.id,
    price: orderHistory.price,
    status: orderHistory.status,
    date: orderHistory.date,
    orders: simplifiedOrders,
  };
};

export const singleSimplifiedRequestHistory = (requestHistory: TransactionRequest): SimplifiedRequest[] | null => {
  if (!requestHistory) return null;

  return requestHistory.requests.map((request) => ({
    id: requestHistory.id,
    requestId: request.id,
    price: requestHistory.price ?? 0,
    status: request.status,
    date: requestHistory.date,
    request_name: request.request_name,
    design_user: request.design_user,
    design_admin: request.design_admin,
    quantity: request.quantity,
    color: request.color,
    size: request.size,
  }));
};
