import { atom } from "nanostores";

export const productOptionStore = atom<any | undefined>();

export const addOption = (item: any) => {
  productOptionStore.set(item);
};
