import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cartStore } from "@/stores/cart";
import { useStore } from "@nanostores/react";
import { ShoppingCartIcon } from "lucide-react";

function CartBadge() {
  const cart = useStore(cartStore);
  const totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <a
      href="/gio-hang"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative"
      )}
    >
      {totalQuantity > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
          {totalQuantity}
        </span>
      )}
      <ShoppingCartIcon />
    </a>
  );
}

export default CartBadge;
