interface TransactionRequest {
  id: string;
  price: number | null;
  date: Date;
  requests: TransactionRequestDetail[];
}

interface SimplifiedRequest {
  id: string;
  price: number;
  requestId: string;
  status: string;
  date: Date;
  quantity: number;
  color: string;
  size: string;
  design_user: string;
  design_admin: string[] | null;
  request_name: string;
}

interface TransactionRequestDetail {
  id: string;
  request_name: string;
  design_user: string;
  status: string;
  design_admin: string[] | null;
  quantity: number;
  color: string;
  size: string;
}
