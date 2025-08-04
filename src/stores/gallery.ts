import type { CarouselApi } from "@/components/ui/carousel";
import { atom } from "nanostores";

export const galleryAtom = atom<{
  api?: CarouselApi;
  data?: any[];
} | null>(null);

export const galleryGo = (variantId: string) => {
  const data = galleryAtom.get()?.data;
  const api = galleryAtom.get()?.api;
  if (!data && !api) return;
  const index = data?.findIndex((item) => item.id == variantId);
  if (index == -1) return;
  api?.scrollTo(Number(index));
};
