export interface Order {
  id: number;
  total: number;
  created_at: Date;
}

export interface newOrder {
  total: number;
  payment: string;
}

export interface OrderHistory {
  id: number;
  total: number;
  created_at: Date;
  payment: string;
  time: string;
}
