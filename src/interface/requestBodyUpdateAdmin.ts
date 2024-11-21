import { Status } from "@prisma/client";

export interface RequestBodyAdmin {
  status: Status;
  total_price: string;
  image?: string[];
}
