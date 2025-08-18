import type {
  AuthType,
  CartItem,
  CartType,
  NotificationType,
} from "@/lib/type";
import { formatVND } from "@/lib/utils";
import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";
import type { Alpine } from "alpinejs";
import { pb } from "./lib/pocketbase";

const STORAGE_KEY = "cart";

function saveCart(data: Map<string, CartItem>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(data.entries())));
}

function loadCart(): Map<string, CartItem> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? new Map(JSON.parse(stored)) : new Map();
}

export default (Alpine: Alpine) => {
  Alpine.plugin([intersect, focus, persist]);

  function cart(): CartType {
    return {
      data: loadCart(),
      get totalQuantity() {
        let total = 0;
        for (const { quantity } of this.data.values()) {
          total += Number(quantity) || 0;
        }
        return total;
      },
      get get() {
        return Array.from(this.data.values());
      },
      addToCart(item) {
        if (!item?.id) return;
        const existingItem = this.data.get(item.id);

        const formatData = {
          ...item,
          formatPrice: formatVND(item.price),
          formatPriceDiscount: formatVND(
            Number(item?.price) * (1 - Number(item?.discount))
          ),
        };

        if (existingItem) {
          const newData = {
            ...formatData,
            quantity: Number(existingItem?.quantity) + Number(item.quantity),
          };
          this.data.set(item.id, newData);
        } else {
          this.data.set(item.id, formatData);
        }

        saveCart(this.data);

        const notification = Alpine.store("notification") as NotificationType;

        notification.notify(formatData, "cart");
      },
      save() {
        saveCart(this.data);
      },
      get calc() {
        let tmpPrice = 0;
        let finalPrice = 0;
        let totalDiscount = 0;

        for (const { quantity, price, discount } of this.data.values()) {
          const qty = Number(quantity);
          const pr = Number(price);
          const dis = Number(discount) || 0;

          tmpPrice += qty * pr;
          finalPrice += qty * pr * (1 - dis);
          totalDiscount += qty * pr * dis;
        }

        return {
          tmpPrice,
          finalPrice,
          totalDiscount,
          formatTmpPrice: formatVND(tmpPrice),
          formatFinalPrice: formatVND(finalPrice),
        };
      },
    };
  }

  function auth(): AuthType {
    return {
      openModal: false,
      tab: 0,
      closeModal() {
        this.openModal = false;
      },
      user: {
        id: pb.authStore.record?.id,
        name: pb.authStore.record?.name[0],
      },
      handleLogout() {
        this.user = {};
      },
    };
  }

  Alpine.store("cart", cart());

  Alpine.store("auth", auth());
};
