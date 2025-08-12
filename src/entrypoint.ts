import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";
import type { Alpine } from "alpinejs";
import { formatVND } from "./lib/utils";

export default (Alpine: Alpine) => {
  Alpine.plugin([intersect, focus, persist]);

  interface NotificationType {
    position: "top-start" | "top-end" | "bottom-start" | "bottom-end";
    autoClose: boolean;
    autoCloseDelay: number;
    nextId: number;
    transitionClasses: any;
    notifications: {
      id: number;
      data: any;
      type: string;
      visible: boolean;
    }[];
    triggerNotification: (message: string, type: string, link: string) => void;
    dismissNotification: (id: number) => void;
  }
  Alpine.store("notification", {
    position: "top-end",
    autoClose: true,
    autoCloseDelay: 5000,
    notifications: [],
    nextId: 1,

    transitionClasses: {
      "x-transition:enter-start"() {
        if (this.position === "top-start" || this.position === "bottom-start") {
          return "opacity-0 -translate-x-12 rtl:translate-x-12";
        } else if (
          this.position === "top-end" ||
          this.position === "bottom-end"
        ) {
          return "opacity-0 translate-x-12 rtl:-translate-x-12";
        }
      },
      "x-transition:leave-end"() {
        if (this.position === "top-start" || this.position === "bottom-start") {
          return "opacity-0 -translate-x-12 rtl:translate-x-12";
        } else if (
          this.position === "top-end" ||
          this.position === "bottom-end"
        ) {
          return "opacity-0 translate-x-12 rtl:-translate-x-12";
        }
      },
    },

    triggerNotification(data: any, type: string) {
      const id = this.nextId++;
      this.notifications.push({ id, data, type, visible: false });
      setTimeout(() => {
        const index = this.notifications.findIndex((n: any) => n.id === id);

        if (index > -1) {
          this.notifications[index].visible = true;
        }
      }, 30);

      if (this.autoClose) {
        setTimeout(() => this.dismissNotification(id), this.autoCloseDelay);
      }
    },

    dismissNotification(id: number) {
      const index = this.notifications.findIndex((n: any) => n.id === id);

      if (index > -1) {
        this.notifications[index].visible = false;

        setTimeout(() => {
          this.notifications.splice(index, 1);
        }, 300);
      }
    },
  } as NotificationType);

  interface CartItem {
    id: string;
    name: string;
    price: number;
    discount: number;
    thumbnail: string;
    slug: string;
    quantity: number;
  }
  interface CartType {
    items: any;
    totalQuantity: number | null;
    addToCart: (item: CartItem) => void;
  }

  Alpine.store("cart", {
    items: Alpine.$persist<CartItem[]>([]).as("cart"),
    get totalQuantity() {
      return this.items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      );
    },
    addToCart(item: CartItem) {
      const index = this.items.findIndex((i: any) => i.id === item.id);

      if (index > -1) {
        this.items[index].quantity += item.quantity;
      } else {
        this.items.push(item);
      }
      (Alpine.store("notification") as any)?.triggerNotification(
        {
          ...item,
          price: formatVND(item.price),
          priceDiscount: formatVND(item.price * (1 - item.discount)),
        },
        "cart"
      );
    },
  } as CartType);

  return Alpine;
};
