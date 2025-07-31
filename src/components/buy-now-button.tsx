import type { OrderItemType } from "@/components/order-form";
import { addToOrder } from "@/stores/order";

interface BuyNowButtonProps {
  item: OrderItemType;
  className?: string;
}

function BuyNowButton({ item, className }: BuyNowButtonProps) {
  return (
    <a
      href="/mua-ngay"
      className={className}
      onClick={() => {
        console.log(item);
        addToOrder(item);
      }}
    >
      Mua ngay
    </a>
  );
}

export default BuyNowButton;
