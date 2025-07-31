import OrderForm from "@/components/order-form";
import { orderStore } from "@/stores/order";
import { useStore } from "@nanostores/react";

function BuyNowForm() {
  const order = useStore(orderStore);

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
    items: order ? [order] : [],
  };

  return (
    <div className="max-w-6xl mx-auto px-2 lg:px-0">
      <h3 className="font-bold text-lg">Mua Hàng</h3>
      <OrderForm defaultValues={defaultValues} />
    </div>
  );
}

export default BuyNowForm;
