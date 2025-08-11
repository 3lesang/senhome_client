import focus from "@alpinejs/focus";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";
import type { Alpine } from "alpinejs";
import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
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

  interface ProductCarouselData {
    embla: EmblaCarouselType | null;
    index: number;
    init(): void;
    scrollTo(index: number, jump?: boolean): void;
  }

  Alpine.data(
    "productCarousel",
    (): ProductCarouselData => ({
      embla: null,
      index: 0,
      init() {
        const emblaNode = document.querySelector(".embla");
        if (!emblaNode) {
          return;
        }
        const emblaApi = EmblaCarousel(emblaNode as HTMLElement);

        this.embla = emblaApi;
        this.embla.on("select", (value) => {
          this.index = value.selectedScrollSnap();
        });
      },
      scrollTo(index, jump) {
        this.embla?.scrollTo(index, jump);
      },
    })
  );

  interface CarouselData {
    embla: EmblaCarouselType | null;
    canPrev: boolean | undefined;
    canNext: boolean | undefined;
    init(): void;
    prev(): void;
    next(): void;
    destroy(): void;
  }

  Alpine.data(
    "carousel",
    (): CarouselData => ({
      embla: null,
      canPrev: false,
      canNext: false,

      init() {
        const emblaNode = document.querySelector(".embla");
        if (!emblaNode) {
          return;
        }
        const plugins = [Autoplay({ delay: 3000, stopOnInteraction: false })];
        const options = { loop: false };
        const emblaApi = EmblaCarousel(
          emblaNode as HTMLElement,
          options,
          plugins
        );

        this.embla = emblaApi;

        this.canPrev = this.embla.canScrollPrev();
        this.canNext = this.embla.canScrollNext();

        this.embla.on("select", () => {
          this.canPrev = this.embla?.canScrollPrev();
          this.canNext = this.embla?.canScrollNext();
        });
      },
      prev() {
        this.embla?.scrollPrev();
      },
      next() {
        this.embla?.scrollNext();
      },
      destroy() {
        this.embla?.destroy();
      },
    })
  );

  function arraysMatch(arr1: any, arr2: any) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value: string, index: number) => value === arr2[index])
    );
  }

  Alpine.data("options", (variants: any[]) => ({
    passed: false,
    variant: {},
    options: new Map<string, any>(),

    handleSelect(option_id: string, data: any) {
      this.options.set(option_id, data);
      const options = Array.from(this.options.entries()).map(
        ([id, data]) => data.id
      );
      const variant = variants.find((item) =>
        arraysMatch(item.values, options)
      );
      if (!variant) {
        this.variant = {};
        return;
      }
      this.variant = {
        id: variant?.variant?.id,
        name: variant?.variant?.name,
        price: formatVND(variant?.variant?.price),
        priceDiscount: formatVND(
          variant?.variant?.price * (1 - variant?.variant?.discount)
        ),
        discount: `-${variant?.variant?.discount * 100}%`,
      };
    },
    selected(option_id: string, value_id: string) {
      if (!this.options.has(option_id)) return;
      return this.options.get(option_id).id == value_id;
    },
    checkScroll() {
      const el = this?.$refs.target;
      const rect = el.getBoundingClientRect();
      this.passed = rect.top < 0;
    },
  }));
  return Alpine;
};
