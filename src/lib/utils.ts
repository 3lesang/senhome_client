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

export const convertImageUrl = (image: any) => {
  if (!image?.id) return;
  return `${API_URL}/api/files/${image?.collectionName}/${image?.id}/${image?.image}`;
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
    const variant = record?.expand?.variant;
    if (attrId && attrValue) {
      if (!attributeMap.has(attrId)) {
        attributeMap.set(attrId, {
          name: attrName || "Unknown",
          values: new Set(),
        });
      }
      attributeMap.get(attrId).values.add({ ...attrValue, variant });
    }
  });

  const result = Array.from(attributeMap.entries()).map(([id, data]) => ({
    attribute_id: id,
    attribute_name: data.name,
    values: Array.from(data.values),
  }));

  return result;
};

export const formatVariantOption = (data: any, options: any) => {
  const variantAttrMap = new Map<string, Map<string, string>>();
  const variantStockMap = new Map<string, number>();

  for (const item of data) {
    const variantId = item.variant;
    const attrId = item.attribute;
    const valueId = item.attribute_value;
    const variant = item.expand?.variant;

    if (!variantId || !attrId || !valueId || !variant) continue;

    if (!variantAttrMap.has(variantId)) {
      variantAttrMap.set(variantId, new Map());
      variantStockMap.set(variantId, Number(variant.stock_quantity) || 0);
    }

    variantAttrMap.get(variantId)?.set(attrId, valueId);
  }

  let total = 0;

  for (const [variantId, attrMap] of variantAttrMap.entries()) {
    const matches =
      Object.keys(options).length === 0 ||
      Object.entries(options).every(
        ([attrId, valueId]) => attrMap.get(attrId) === valueId
      );

    if (matches) {
      total += variantStockMap.get(variantId) ?? 0;
    }
  }
  return total;
};
