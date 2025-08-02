import { Button } from "@/components/ui/button";
import { pb, PRODUCT_VARIANT_ATTRIBUTES_COLLECTION } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { orderStore } from "@/stores/order";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

interface ProductVariantFormProps {
  data: any[];
  id: string;
}

function ProductVariantForm({ id, data }: ProductVariantFormProps) {
  const order = useStore(orderStore);
  const client = useStore(queryClient);
  const [options, setOptions] = useState<Record<string, string>>({});

  const { data: totalStock } = useQuery(
    {
      queryKey: [PRODUCT_VARIANT_ATTRIBUTES_COLLECTION, id, options],
      queryFn: () =>
        pb.collection(PRODUCT_VARIANT_ATTRIBUTES_COLLECTION).getFullList({
          filter: `variant.product="${id}"`,
          expand: "variant",
          fields:
            "variant,attribute,attribute_value,expand.variant.id,expand.variant.stock_quantity",
        }),
      select(data) {
        const variantAttrMap = new Map<string, Map<string, string>>();
        const variantStockMap = new Map<string, number>();

        for (const item of data) {
          const variantId = item.variant;
          const attrId = item.attribute;
          const valueId = item.attribute_value;
          const variant = item.expand?.variant;

          if (!variantId || !attrId || !valueId || !variant) continue;

          if (!variantAttrMap.has(variantId)) {
            variantAttrMap.set(variantId, new Map());
            variantStockMap.set(variantId, Number(variant.stock_quantity) || 0);
          }

          variantAttrMap.get(variantId)?.set(attrId, valueId);
        }

        let total = 0;

        for (const [variantId, attrMap] of variantAttrMap.entries()) {
          const matches =
            Object.keys(options).length === 0 ||
            Object.entries(options).every(
              ([attrId, valueId]) => attrMap.get(attrId) === valueId
            );

          if (matches) {
            total += variantStockMap.get(variantId) ?? 0;
          }
        }

        return total;
      },
      enabled: !!id,
    },
    client
  );

  const handlePlus = () => {
    if (!order) return;
    if (!totalStock) return;
    if (order.quantity >= totalStock) return;
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
    <div className="space-y-2 text-sm text-gray-600">
      {data?.map((attribute) => (
        <div className="space-x-4" key={attribute?.attribute_id}>
          <span>{attribute?.attribute_name}</span>
          <span className="space-x-2">
            {attribute?.values?.map((value: any) => (
              <button
                key={value?.id}
                className={cn(
                  "cursor-pointer inline border px-2 py-1 rounded hover:ring hover:border-transparent hover:text-blue-500 hover:ring-blue-500",
                  value?.id == options?.[attribute?.attribute_id]
                    ? "ring ring-blue-500 text-blue-500 border-transparent"
                    : ""
                )}
                id={value?.id}
                onClick={() =>
                  setOptions((option: any) => ({
                    ...option,
                    [attribute?.attribute_id]: value?.id,
                  }))
                }
              >
                {value?.name}
              </button>
            ))}
          </span>
        </div>
      ))}
      <div className="space-x-4 select-none">
        <span>Số lượng</span>
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
            type="button"
            size="icon"
            variant="outline"
            className="cursor-pointer"
            onClick={handlePlus}
          >
            <PlusIcon />
          </Button>
        </span>
        {Number(totalStock) > 0 && <span>{totalStock} sản phẩm có sẵn</span>}
      </div>
    </div>
  );
}

export default ProductVariantForm;
