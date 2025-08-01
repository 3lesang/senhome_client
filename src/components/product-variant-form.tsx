import { Button } from "@/components/ui/button";
import { pb, PRODUCT_VARIANT_COLLECTION } from "@/lib/pocketbase";
import { orderStore } from "@/stores/order";
import { queryClient } from "@/stores/query";
import "@/styles/content.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "./ui/form";

interface ProductVariantFormProps {
  colors?: { id: string; name: string; hex_code?: string }[];
  sizes?: { id: string; name: string }[];
  materials?: { id: string; name: string }[];
}

const formSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
});

type ProductVariantFormType = z.infer<typeof formSchema>;

function buildVariantFilter({
  size,
  color,
  material,
}: {
  size?: string;
  color?: string;
  material?: string;
}) {
  const conditions = [];

  if (size) conditions.push(`size = "${size}"`);
  if (color) conditions.push(`color = "${color}"`);
  if (material) conditions.push(`material = "${material}"`);

  return conditions.join(" && ");
}

function ProductVariantForm({
  sizes,
  colors,
  materials,
}: ProductVariantFormProps) {
  const order = useStore(orderStore);
  const client = useStore(queryClient);

  const form = useForm<ProductVariantFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "",
      size: "",
      material: "",
    },
  });

  const color = form.watch("color");
  const size = form.watch("size");
  const material = form.watch("material");

  const { data } = useQuery(
    {
      queryKey: [PRODUCT_VARIANT_COLLECTION, color, size, material],
      queryFn: () =>
        pb.collection(PRODUCT_VARIANT_COLLECTION).getFullList({
          filter: buildVariantFilter({ color, size, material }),
          fields: "stock_quantity",
        }),
    },
    client
  );

  const stocks = data?.reduce((sum, item) => sum + item.stock_quantity, 0);

  const handlePlus = () => {
    if (!order) return;
    if (!stocks) return;
    if (order.quantity >= stocks) return;
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
    <Form {...form}>
      <div className="space-y-2 text-sm text-gray-600">
        {Number(colors?.length) > 0 && (
          <div className="space-x-4">
            <span>Màu sắc</span>
            <span className="">
              {colors?.map((item) => (
                <Button
                  key={item?.id}
                  variant={
                    form.watch("color") == item?.id ? "secondary" : "ghost"
                  }
                  className="cursor-pointer"
                  onClick={() => form.setValue("color", item.id)}
                >
                  {item?.name}
                </Button>
              ))}
            </span>
          </div>
        )}
        {Number(sizes?.length) > 0 && (
          <div className="space-x-4">
            <span>Kích thước</span>
            <span className="">
              {sizes?.map((item) => (
                <Button
                  key={item?.id}
                  variant={
                    form.watch("size") == item?.id ? "secondary" : "ghost"
                  }
                  className="cursor-pointer"
                  onClick={() => form.setValue("size", item.id)}
                >
                  {item?.name}
                </Button>
              ))}
            </span>
          </div>
        )}
        {Number(materials?.length) > 0 && (
          <div className="space-x-4">
            <span>Chất liệu</span>
            <span className="">
              {materials?.map((item) => (
                <Button
                  key={item?.id}
                  variant={
                    form.watch("material") == item?.id ? "secondary" : "ghost"
                  }
                  className="cursor-pointer"
                  onClick={() => form.setValue("material", item.id)}
                >
                  {item?.name}
                </Button>
              ))}
            </span>
          </div>
        )}
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
              disabled={stocks ? Number(order?.quantity) >= stocks : true}
              type="button"
              size="icon"
              variant="outline"
              className="cursor-pointer"
              onClick={handlePlus}
            >
              <PlusIcon />
            </Button>
          </span>
          {Number(data?.length) > 0 ? (
            <span>{stocks} sản phẩm có sẵn</span>
          ) : (
            <span>Hết hàng</span>
          )}
        </div>
      </div>
    </Form>
  );
}

export default ProductVariantForm;
