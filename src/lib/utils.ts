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

export const convertToFileUrl = (record: any) => {
  if (!record?.id) return;
  return `${API_URL}/api/files/${record?.collectionName}/${record?.id}/${record?.file}`;
};

export const buildTree = (data: any[]): any[] => {
  const map = new Map<string, any>();
  const tree: any[] = [];

  data.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  data.forEach((item) => {
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

export const groupByAttributes = (data: any[]) => {
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

export const groupByVariant = (data: any[]) => {
  const map = new Map();
  data.forEach((record) => {
    const variantId = record.variant;
    const variant = record.expand?.variant;
    const attribute_value = record.expand?.attribute_value;
    if (variantId) {
      if (!map.has(variantId)) {
        map.set(variantId, { variant, values: [] });
      }
      map.get(variantId).values.push(attribute_value?.id);
    }
  });

  const result = Array.from(map.entries())
    .map(([_, data]) => ({
      variant: data.variant,
      values: data.values,
    }))
    .toSorted((a, b) => a.variant.price - b.variant.price);
  return result;
};

type RatingBreakdown = { stars: number; count: number; percent: number };

interface RatingResult {
  average: number;
  breakdown: RatingBreakdown[];
}

export const calculateRatingStats = (ratings: any[]): RatingResult => {
  const total = ratings.length;

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  let sum = 0;
  for (const r of ratings) {
    if (counts[r.rating] !== undefined) {
      counts[r.rating] += 1;
      sum += r.rating;
    }
  }

  const average = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

  const breakdown = Array.from({ length: 5 }, (_, i) => {
    const stars = 5 - i;
    const count = counts[stars];
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, count, percent };
  });

  return { average, breakdown };
};
