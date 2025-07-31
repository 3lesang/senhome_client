import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cartStore, clearCart, updateCart } from "@/stores/cart";
import { useStore } from "@nanostores/react";
import { ShoppingCartIcon } from "lucide-react";
import OrderForm from "./order-form";

function CartForm() {
  const cart = useStore(cartStore);

  const defaultValues = {
    name: "",
    phone: "",
    email: "",
    province: { label: "", value: "" },
    district: { label: "", value: "" },
    ward: { label: "", value: "" },
    street: "",
    payment: "cash",
    shippingFee: 25000,
    items: cart.items,
  };

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
    <div className="max-w-6xl mx-auto px-2 lg:px-0">
      <h3 className="font-bold text-lg">Giỏ hàng</h3>
      <OrderForm
        defaultValues={defaultValues}
        onSuccess={() => clearCart()}
        onItemsChange={(values) => updateCart(values)}
      />
    </div>
  );
}

export default CartForm;
