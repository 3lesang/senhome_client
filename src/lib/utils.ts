import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(n: number = 0) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(n);
}

export const getTotalDiscountPrice = (items: any[]) => {
  return items.reduce((total, item) => {
    if (item.discount) {
      const discountAmount = item.price * item.quantity * item.discount;
      return total + discountAmount;
    }
    return total;
  }, 0);
};

export const getTotalPriceItems = (items: any[]) => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};
