interface Products {
  name: string;
  image: string | null;
  price: number;
}

interface Order {
  color: string;
  size: string;
  products: Products;
  quantity: number;
}

interface Transaction {
  id: string;
  price: number | null;
  status: string;
  date: Date;
  orders: Order[];
}

interface SimplifiedOrder {
  name: string;
  image: string | null;
  quantity: number;
  color: string;
  size: string;
  price: number;
}

interface SimplifiedTransaction {
  id: string;
  price: number | null;
  status: string;
  date: Date;
  orders: SimplifiedOrder[];
}
