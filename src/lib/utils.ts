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

export const formatAttributes = (data: any[]) => {
  const attributeMap = new Map();

  data.forEach((record) => {
    const attrId = record.attribute;
    const attrName = record.expand?.attribute?.name;
    const attrValue = record.expand?.attribute_value;

    if (attrId && attrValue) {
      if (!attributeMap.has(attrId)) {
        attributeMap.set(attrId, {
          name: attrName || "Unknown",
          values: new Set(),
        });
      }
      attributeMap.get(attrId).values.add(attrValue);
    }
  });

  const result = Array.from(attributeMap.entries()).map(([id, data]) => ({
    attribute_id: id,
    attribute_name: data.name,
    values: Array.from(data.values),
  }));

  return result;
};
