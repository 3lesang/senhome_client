import { toast } from "@/components/toast";
import { addToCart } from "@/stores/cart";
import { orderStore } from "@/stores/order";
import { useStore } from "@nanostores/react";

interface AddToCartButtonProps {
  className?: string;
}

function AddToCartButton({ className }: AddToCartButtonProps) {
  const order = useStore(orderStore);

  const handleAddToCart = () => {
    if (!order) return;
    addToCart(order);
    toast(
      <div className="bg-white shadow py-2 px-4 rounded-md">
        Đã thêm sản phẩm vào giỏ hàng
        <a
          href="/gio-hang"
          className="cursor-pointer ml-2 font-bold hover:underline"
        >
          Xem giỏ hàng
        </a>
      </div>
    );
  };
  return (
    <button className={className} onClick={handleAddToCart}>
      Thêm vào giỏ hàng
    </button>
  );
}

export default AddToCartButton;
