import { convertImageUrl, formatVND } from "@/lib/utils";
import QuantityCounter from "./quantity-counter";
import { Badge } from "./ui/badge";

interface CartProductItemMobileProps {
  data?: any;
}

function CartProductItemMobile({ data }: CartProductItemMobileProps) {
  const { discount, price } = data;
  const image = convertImageUrl(data?.thumbnail);
  return (
    <div className="flex gap-2">
      <div className="min-w-20 h-20 rounded overflow-hidden bg-gray-50">
        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
      </div>
      <div>
        <p className="line-clamp-1">{data?.name}</p>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {Number(discount) > 0 && (
              <Badge className="font-bold">-{discount * 100}%</Badge>
            )}
            <span className="text-lg font-bold">
              {formatVND(price - price * (discount || 0))}
            </span>
            {Number(discount) > 0 && (
              <span className="text-gray-500 line-through">
                {formatVND(price)}
              </span>
            )}
          </div>

          <QuantityCounter />
        </div>
      </div>
    </div>
  );
}

export default CartProductItemMobile;
