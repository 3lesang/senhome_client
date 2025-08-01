import { API_URL } from "@/lib/pocketbase";
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

export const convertImageUrl = (type?: string, id?: string, name?: string) => {
  return name ? `${API_URL}/api/files/${type}/${id}/${name}` : "/empty.png";
};

export const buildCategoryTree = (flat: any[]): any[] => {
  const map = new Map<string, any>();
  const tree: any[] = [];

  flat.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  flat.forEach((item) => {
    if (item.parent) {
      const parent = map.get(item.parent);
      if (parent) {
        parent.children?.push(map.get(item.id)!);
      }
    } else {
      tree.push(map.get(item.id)!);
    }
  });

  return tree;
};

type Variant = {
  id: string;
  expand?: {
    color?: { id: string; name: string; hex_code?: string };
    size?: { id: string; name: string };
    material?: { id: string; name: string };
  };
};

export function getUniqueVariants(variants: Variant[]) {
  const colorMap = new Map<
    string,
    { id: string; name: string; hex_code?: string }
  >();
  const sizeMap = new Map<string, { id: string; name: string }>();
  const materialMap = new Map<string, { id: string; name: string }>();

  for (const variant of variants) {
    const color = variant.expand?.color;
    const size = variant.expand?.size;
    const material = variant.expand?.material;

    if (color && !colorMap.has(color.id)) {
      colorMap.set(color.id, {
        id: color.id,
        name: color.name,
        hex_code: color.hex_code,
      });
    }

    if (size && !sizeMap.has(size.id)) {
      sizeMap.set(size.id, {
        id: size.id,
        name: size.name,
      });
    }

    if (material && !materialMap.has(material.id)) {
      materialMap.set(material.id, {
        id: material.id,
        name: material.name,
      });
    }
  }

  return {
    colors: Array.from(colorMap.values()),
    sizes: Array.from(sizeMap.values()),
    materials: Array.from(materialMap.values()),
  };
}
