import type { OrderItemType } from "@/components/order-form";
import { atom, onMount } from "nanostores";

export type CartState = {
  items: OrderItemType[];
};

export const cartStore = atom<CartState>({
  items: [],
});

onMount(cartStore, () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cartStore.set(parsedCart);
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }

  return cartStore.subscribe((state) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cart", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  });
});

export const addToCart = (item: OrderItemType) => {
  const { items } = cartStore.get();

  const existingIndex = items.findIndex((i) => i.id === item.id);
  let newItems: OrderItemType[];

  if (existingIndex > -1) {
    const existing = items[existingIndex];
    newItems = [
      ...items.slice(0, existingIndex),
      {
        ...existing,
        quantity: existing.quantity + item.quantity,
      },
      ...items.slice(existingIndex + 1),
    ];
  } else {
    newItems = [...items, { ...item, selected: true }];
  }

  cartStore.set({
    items: newItems,
  });
};

export const updateCart = (items: OrderItemType[]) => {
  cartStore.set({ items });
};

export const clearCart = () => {
  const { items } = cartStore.get();

  const remainingItems = items.filter((item) => !item.selected);

  cartStore.set({
    items: remainingItems,
  });
};
