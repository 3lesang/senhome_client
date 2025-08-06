import DistrictSelect from "@/components/district-select";
import OrderItemTable from "@/components/order-item-table";
import PaymentSelect from "@/components/payment-select";
import ProvinceSelect from "@/components/province-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import WardSelect from "@/components/ward-select";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigate } from "@/lib/navigate";
import { ORDER_COLLECTION, ORDER_ITEM_COLLECTION, pb } from "@/lib/pocketbase";
import {
  formatVND,
  getTotalDiscountPrice,
  getTotalPriceItems,
} from "@/lib/utils";
import { queryClient } from "@/stores/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";
import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ProductListMobile from "./product-list-mobile";

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  discount: z.number(),
  thumbnail: z.string(),
  slug: z.string(),
  quantity: z.number(),
  selected: z.boolean().optional(),
});

const addressSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Vui lòng nhập họ và tên",
  }),
  phone: z.string().min(10, {
    message: "Vui lòng điền số điện thoại",
  }),
  email: z.string().min(2, {
    message: "Vui lòng điền địa chỉ email",
  }),
  province: addressSchema.refine((val) => val.value, {
    message: "Vui lòng chọn tỉnh/thành",
  }),
  district: addressSchema.refine((val) => val.value, {
    message: "Vui lòng chọn quận/huyện",
  }),
  ward: addressSchema.refine((val) => val.value, {
    message: "Vui lòng chọn phường/xã",
  }),
  street: z.string().min(1, {
    message: "Vui lòng điền số nhà, tên đường",
  }),
  memo: z.string().optional(),
  payment: z.string(),
  shippingFee: z.number(),
  items: z.array(orderItemSchema).min(1, "Vui lòng chọn sản phẩm"),
});

export type OrderFormType = z.infer<typeof formSchema>;

export type OrderItemType = z.infer<typeof orderItemSchema>;

type OrderItemCreateType = {
  discount: number;
  price: number;
  name: string;
  product_id: string;
  quantity: number;
  order_id: string;
};

type OrderCreateType = {
  user_full_name: string;
  user_phone: string;
  user_email: string;
  total_price: number;
  discount_total: number;
  final_price: number;
  shipping_address: string;
  payment_method: string;
  memo?: string;
  shipping_fee?: number;
  items: OrderItemType[];
};

interface OrderFormProps {
  defaultValues?: OrderFormType;
  onItemsChange?: (values: OrderItemType[]) => void;
  onSuccess?: () => void;
}

function OrderForm({
  defaultValues,
  onSuccess,
  onItemsChange,
}: OrderFormProps) {
  const client = useStore(queryClient);
  const form = useForm<OrderFormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const isMobile = useIsMobile();
  const items = form.watch("items").filter((item) => item?.selected);

  const discountTotal = getTotalDiscountPrice(items);
  const totalPrice = getTotalPriceItems(items);
  const shippingFee = form.getValues("shippingFee");
  const finalPrice = totalPrice - discountTotal + shippingFee;

  const { mutate: orderMutate, isPending } = useMutation(
    {
      mutationFn: async (values: OrderCreateType) => {
        const res = await pb.collection(ORDER_COLLECTION).create(values);
        const orderId = res?.id;
        const orderItems = values.items.map((item) => {
          const value: OrderItemCreateType = {
            product_id: item?.id,
            name: item?.name,
            discount: item?.discount,
            quantity: item?.quantity,
            price: item?.price,
            order_id: orderId,
          };
          return value;
        });

        await Promise.all(
          orderItems.map((record) =>
            pb
              .collection(ORDER_ITEM_COLLECTION)
              .create(record, { $autoCancel: false })
          )
        );
        return { id: orderId };
      },
      onSuccess: (data) => {
        const url = `/don-hang/${data.id}`;
        navigate(url);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        onSuccess?.();
      },
    },
    client
  );

  const handleSubmit = (values: OrderFormType) => {
    const payload: OrderCreateType = {
      user_full_name: values.name,
      user_phone: values.phone,
      user_email: values.email,
      total_price: totalPrice,
      discount_total: discountTotal,
      final_price: finalPrice,
      shipping_address: `${values.street}, ${values.ward.label}, ${values.district.label}, ${values.province.label}`,
      payment_method: values.payment,
      memo: values.memo,
      shipping_fee: values.shippingFee,
      items: values.items.filter((item) => item?.selected),
    };
    orderMutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <p className="font-bold my-4">Đơn hàng</p>
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {isMobile ? (
                    <ProductListMobile data={field.value} />
                  ) : (
                    <OrderItemTable
                      data={field.value}
                      onChange={(items) => {
                        form.setValue("items", items);
                        onItemsChange?.(items);
                      }}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4" />
        <div>
          <p className="font-bold my-4">Thông tin khách hàng</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-3 lg:col-span-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Họ và tên" {...field} className="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3 lg:col-span-1">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số điện thoại"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} className="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-4" />
        <div>
          <p className="font-bold my-4">Địa chỉ nhận hàng</p>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3 lg:col-span-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành phố</FormLabel>
                    <FormControl>
                      <ProvinceSelect
                        value={field.value.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3 lg:col-span-2">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quận/Huyện</FormLabel>
                    <FormControl>
                      <DistrictSelect
                        province={form.watch("province").value}
                        value={field.value.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6 lg:col-span-2">
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xã/Phường</FormLabel>
                    <FormControl>
                      <WardSelect
                        district={form.watch("district").value}
                        value={field.value.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số nhà, tên đường</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số nhà, tên đường (VD: 123 Đường ABC)"
                        {...field}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú"
                        {...field}
                        className=" resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="mt-4" />
        <div>
          <p className="font-bold my-4">Hình thức thanh toán</p>
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PaymentSelect
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4" />
        <div>
          <p className="font-bold my-4">Chi tiết thanh toán</p>
          <div>
            <div className="flex justify-between items-center">
              <p>Tạm tính</p>
              <p className="">{formatVND(totalPrice)}</p>
            </div>
            <div className="flex justify-between items-center my-4">
              <p>Giảm giá</p>
              <p className="">-{formatVND(discountTotal)}</p>
            </div>
            <div className="flex justify-between items-center my-4">
              <p>Phí giao hàng</p>
              <p className="">+{formatVND(form.getValues("shippingFee"))}</p>
            </div>
            <Separator />
            <div className="flex justify-between items-center my-4">
              <p>Thành tiền</p>
              <p className="font-bold">{formatVND(finalPrice)}</p>
            </div>
          </div>
        </div>
        <div className="mt-4" />
        <Button
          className="w-full h-10 cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          {isPending && <Loader2Icon className="animate-spin" />}
          Đặt hàng
        </Button>
      </form>
    </Form>
  );
}

export default OrderForm;
