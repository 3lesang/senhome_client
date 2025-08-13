import { type EmblaCarouselType } from "embla-carousel";

export interface NotificationType {
  position: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  autoClose: boolean;
  autoCloseDelay: number;
  nextId: number;
  notifications: {
    id: number;
    data: any;
    type: string;
    visible: boolean;
  }[];
  notify: (data: any, type: string) => void;
  dismiss: (id: number) => void;
}

export interface CartItem {
  id?: string;
  name?: string;
  price?: number;
  discount?: number;
  thumbnail?: string;
  slug?: string;
  quantity?: number;
  variant?: CartItem;
  options?: {
    attribute_name: string;
    attribute_id: string;
    value_name: string;
    value_id: string;
  }[];
  formatPrice?: string;
  formatPriceDiscount?: string;
}

export interface CartType {
  data: Map<string, CartItem>;
  totalQuantity: number;
  get: CartItem[];
  addToCart: (item: CartItem) => void;
  save(): void;
  calc: { tmpPrice: string; finalPrice: string };
}

export interface ProductCarouselData {
  embla: EmblaCarouselType | null;
  index: number;
  canPrev: boolean | undefined;
  canNext: boolean | undefined;
  init(): void;
  prev(): void;
  next(): void;
  scrollTo(index: number, jump?: boolean): void;
}

export interface OptionType {
  passed: boolean;
  variant: any | null;
  options: Map<string, any>;
  quantity: number;
  disabled: boolean;
  $refs: {
    target: HTMLElement;
  };
  handleSelect(option_id: string, data: any): void;
  selected(option_id: string, value_id: string): boolean;
  checkScroll(): void;
  handleAddToCart(item: CartItem): void;
}
