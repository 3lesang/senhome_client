import PocketBase from "pocketbase";

export const API_URL = "https://b0m772h91854471.pocketbasecloud.com";

export const pb = new PocketBase(API_URL);

export const PRODUCT_COLLECTION = "sen_products";
export const PRODUCT_VARIANT_COLLECTION = "sen_product_variants";
export const CATEGORY_COLLECTION = "sen_categories";
export const ORDER_COLLECTION = "sen_orders";
export const ORDER_ITEM_COLLECTION = "sen_order_items";
export const USER_COLLECTION = "sen_users";
export const BANNER_COLLECTION = "sen_banners";
