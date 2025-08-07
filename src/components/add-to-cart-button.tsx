import { addToCart } from "@/stores/cart";

interface AddToCartButtonProps {
  className?: string;
  data: any;
}

function AddToCartButton({ className, data }: AddToCartButtonProps) {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(data);
  };
  return (
    <button className={className} onClick={handleAddToCart}>
      Thêm vào giỏ hàng
    </button>
  );
}

export default AddToCartButton;
