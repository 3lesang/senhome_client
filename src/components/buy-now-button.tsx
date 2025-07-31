import type { OrderItemType } from "@/components/order-form";
import { addToOrder } from "@/stores/order";
import { useEffect } from "react";

interface BuyNowButtonProps {
  item: OrderItemType;
  className?: string;
}

function BuyNowButton({ item, className }: BuyNowButtonProps) {
  useEffect(() => {
    addToOrder(item);
  }, []);

  return (
    <a href="/mua-ngay" className={className}>
      Mua ngay
    </a>
  );
}

export default BuyNowButton;
