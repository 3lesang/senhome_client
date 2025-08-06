import { buttonVariants } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { cartStore, updateCart } from "@/stores/cart";
import { useStore } from "@nanostores/react";
import { ShoppingCartIcon } from "lucide-react";
import OrderItemTable from "./order-item-table";
import ProductListMobile from "./product-list-mobile";

function CartForm() {
  const cart = useStore(cartStore);
  const isMobile = useIsMobile();

  if (cart.items.length === 0) {
    return (
      <div className="flex h-full justify-center items-center text-center">
        <div>
          <img
            className="h-44 object-cover mx-auto"
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt=""
          />
          <p className="text-center text-sm text-gray-600 leading-12">
            Giỏ hàng trống
          </p>
          <a href="/" className={cn(buttonVariants(), "")}>
            <ShoppingCartIcon />
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:max-w-6xl mx-auto p-4 space-y-4">
      <h3 className="font-bold text-lg">Giỏ hàng</h3>
      {isMobile ? (
        <ProductListMobile data={cart.items} />
      ) : (
        <OrderItemTable
          data={cart?.items}
          onChange={(data) => updateCart(data)}
        />
      )}
    </div>
  );
}

export default CartForm;
