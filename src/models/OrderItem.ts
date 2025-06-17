export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_order: number;
  name_at_order: string;
}
export type NewOrderItem = {
  productId: number | null;
  quantity: number | null;
  price: number | null;
  name: string | null;
};
