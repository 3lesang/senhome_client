import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <div className="flex items-center mt-8 gap-4">
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
      <div
        className={cn(
          buttonVariants({ variant: "outline" }),
          "select-none text-center"
        )}
      >
        {order?.quantity}
      </div>
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
    </div>
  );
}

export default ProductQuantityCounter;
