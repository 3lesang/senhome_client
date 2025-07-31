import { cn } from "@/lib/utils";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck, TruckIcon } from "lucide-react";
import type { ReactNode } from "react";

type PaymentOption = {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
  disabled?: boolean;
};

export const PAYMENT_OPTIONS: Record<string, PaymentOption> = {
  cash: {
    value: "cash",
    label: "Thanh toán khi nhận hàng",
    description: "Thanh toán khi nhận hàng",
    icon: <TruckIcon className="mb-2.5 text-muted-foreground" />,
  },
  vnpay: {
    value: "vnpay",
    label: "Ví điện tử VNPAY",
    description: "Quét QR code để thanh toán",
    disabled: true,
    icon: (
      <img
        className="mb-2.5 h-8 w-8"
        src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
        alt=""
      />
    ),
  },
};

interface PaymentSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

function PaymentSelect({ value, onChange }: PaymentSelectProps) {
  return (
    <RadioGroup.Root
      defaultValue={value}
      className="w-full grid grid-cols-5 gap-4"
      onValueChange={onChange}
    >
      {Object.values(PAYMENT_OPTIONS).map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            "relative group ring-[1px] ring-border rounded py-2 px-3 text-start",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500 cursor-pointer disabled:cursor-default disabled:bg-gray-50"
          )}
        >
          <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />
          {option.icon}
          <span className="font-semibold tracking-tight">{option.label}</span>
          <p className="text-xs">{option.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

export default PaymentSelect;
