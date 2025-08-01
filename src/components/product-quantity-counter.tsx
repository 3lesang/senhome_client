import { Button } from "@/components/ui/button";
import { orderStore } from "@/stores/order";
import { useStore } from "@nanostores/react";
import { MinusIcon, PlusIcon } from "lucide-react";

function ProductQuantityCounter() {
  const order = useStore(orderStore);
  const handlePlus = () => {
    if (!order) return;
    if (order.quantity >= 99) return;
    orderStore.set({
      ...order,
      quantity: (order.quantity += 1),
    });
  };
  const handleMinus = () => {
    if (!order) return;
    if (order.quantity <= 1) return;
    orderStore.set({
      ...order,
      quantity: (order.quantity -= 1),
    });
  };
  return (
    <span className="space-x-4">
      <Button
        disabled={Number(order?.quantity) <= 1}
        type="button"
        size="icon"
        variant="outline"
        className="cursor-pointer"
        onClick={handleMinus}
      >
        <MinusIcon />
      </Button>
      <span className="select-none">{order?.quantity}</span>
      <Button
        disabled={Number(order?.quantity) >= 99}
        type="button"
        size="icon"
        variant="outline"
        className="cursor-pointer"
        onClick={handlePlus}
      >
        <PlusIcon />
      </Button>
    </span>
  );
}

export default ProductQuantityCounter;
