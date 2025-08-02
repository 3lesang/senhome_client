import { toast } from "@/components/toast";
import { addToCart } from "@/stores/cart";

interface AddToCartButtonProps {
  className?: string;
  data: any;
}

function AddToCartButton({ className, data }: AddToCartButtonProps) {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(data);
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
