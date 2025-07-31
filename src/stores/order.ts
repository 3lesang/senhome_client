import type { OrderItemType } from "@/components/order-form";
import { atom } from "nanostores";

export const orderStore = atom<OrderItemType | undefined>();

export const addToOrder = (item: OrderItemType) => {
  orderStore.set(item);
};
