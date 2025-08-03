import QuantityCounter from "@/components/quantity-counter";
import { pb, PRODUCT_VARIANT_ATTRIBUTES_COLLECTION } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { galleryGo } from "@/stores/gallery";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ProductOptionSelectProps {
  optionData: any[];
  product_id: string;
}

function ProductOptionSelect({
  product_id,
  optionData,
}: ProductOptionSelectProps) {
  const client = useStore(queryClient);

  const [options, setOptions] = useState<Record<string, string>>({});

  const { data } = useQuery(
    {
      queryKey: [PRODUCT_VARIANT_ATTRIBUTES_COLLECTION, product_id, options],
      queryFn: () =>
        pb.collection(PRODUCT_VARIANT_ATTRIBUTES_COLLECTION).getFullList({
          filter: `variant.product="${product_id}"`,
          expand: "variant",
          fields: "variant,attribute,attribute_value,expand.variant",
        }),
      enabled: !!product_id,
    },
    client
  );

  console.log(data);

  const totalStock = 1;
  // const totalStock = formatVariantOption(data, options);

  return (
    <div className="space-y-2 text-sm text-gray-600">
      {optionData?.map((item) => (
        <div className="space-x-4" key={item?.attribute_id}>
          <span>{item?.attribute_name}</span>
          <span className="space-x-2">
            {item?.values?.map((value: any) => (
              <button
                key={value?.id}
                onMouseEnter={() => galleryGo(value?.variant?.id)}
                className={cn(
                  "cursor-pointer inline border px-2 py-1 rounded hover:ring hover:border-transparent hover:text-blue-500 hover:ring-blue-500",
                  value?.id == options?.[item?.attribute_id]
                    ? "ring ring-blue-500 text-blue-500 border-transparent"
                    : ""
                )}
                onClick={() => {
                  galleryGo(value?.variant?.id);
                  setOptions((option: any) => ({
                    ...option,
                    [item?.attribute_id]: value?.id,
                  }));
                }}
              >
                {value?.name}
              </button>
            ))}
          </span>
        </div>
      ))}
      <QuantityCounter onChange={(value) => console.log(value)} />
      {Number(totalStock) > 0 ? (
        <span className="ml-2">{totalStock} sản phẩm có sẵn</span>
      ) : (
        <span className="ml-2">Chưa có sản phẩm</span>
      )}
    </div>
  );
}

export default ProductOptionSelect;
