import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface QuantityCounterProps {
  onChange?: (quantity: number) => void;
}

function QuantityCounter({ onChange }: QuantityCounterProps) {
  const [quantity, setQuantity] = useState(1);

  const handlePlus = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const handleMinus = () => {
    if (quantity < 2) return;
    setQuantity((quantity) => quantity - 1);
  };

  useEffect(() => {
    onChange?.(quantity);
  }, [quantity]);

  return (
    <span className="flex items-center space-x-4">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="cursor-pointer"
        onClick={handleMinus}
      >
        <MinusIcon />
      </Button>
      <span className="select-none">{quantity}</span>
      <Button
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

export default QuantityCounter;
