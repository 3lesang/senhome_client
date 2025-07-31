import { PAYMENT_OPTIONS } from "@/components/payment-select";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDER_COLLECTION, ORDER_ITEM_COLLECTION, pb } from "@/lib/pocketbase";
import { cn, formatVND } from "@/lib/utils";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";

function OrderInfo({ id }: { id: string }) {
  const client = useStore(queryClient);
  const { data } = useQuery(
    {
      queryKey: [ORDER_COLLECTION, id],
      queryFn: () => pb.collection(ORDER_COLLECTION).getOne(id),
      enabled: !!id,
    },
    client
  );

  const { data: orderItems } = useQuery(
    {
      queryKey: [ORDER_ITEM_COLLECTION, id],
      queryFn: () =>
        pb.collection(ORDER_ITEM_COLLECTION).getFullList({
          filter: `order_id = "${id}"`,
        }),
      enabled: !!id,
    },
    client
  );

  return (
    <div className="space-y-4">
      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle> Thông tin nhận hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between">
              <p>Họ và tên</p>
              <p>{data?.user_full_name}</p>
            </div>
            <div className="flex justify-between">
              <p>Số điện thoại</p>
              <p>{data?.user_phone}</p>
            </div>
            <div className="flex justify-between">
              <p>Email</p>
              <p>{data?.user_email}</p>
            </div>
          </div>
          <div className="mt-4"></div>
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between">
              <p>Địa chỉ nhận hàng</p>
              <p>{data?.shipping_address}</p>
            </div>
            <div className="flex justify-between">
              <p>Hình thức thanh toán</p>
              <p>
                {data?.payment_method &&
                  PAYMENT_OPTIONS[data?.payment_method].label}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Ghi chú</p>
              <p>{data?.memo}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-none border-0">
        <CardHeader>
          <CardTitle> Thông tin đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center bg-gray-50 justify-between p-4 rounded-xl">
            <div className="">
              <span>Mã đơn hàng: </span>
              <span>#{data?.id}</span>
            </div>
            <Separator orientation="vertical" />
            <div className="">
              <span>Ngày tạo: </span>
              <span>
                {new Date(data?.created).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Separator className="my-8" />
          <div className="p-4 bg-gray-50 rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tên sản phẩm</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item?.name}
                    </TableCell>
                    <TableCell>
                      {formatVND(item?.price)}{" "}
                      {Number(item?.discount) > 0 && (
                        <Badge className="font-bold px-0.5">
                          -{item?.discount * 100}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatVND(
                        (item?.price -
                          item?.price * item?.discount) *
                          item?.quantity
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-8" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Tạm tính</p>
              <p>{formatVND(data?.total_price)}</p>
            </div>
            <div className="flex justify-between">
              <p>Giảm giá</p>
              <p>-{formatVND(data?.discount_total)}</p>
            </div>
            <div className="flex justify-between">
              <p>Phí vận chuyển</p>
              <p>+{formatVND(data?.shipping_fee)}</p>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex justify-between">
            <p>Thành tiền</p>
            <p className="font-bold text-lg">{formatVND(data?.final_price)}</p>
          </div>
        </CardContent>
      </Card>
      <a href="/" className={cn(buttonVariants(), "w-full my-8")}>
        Tiếp tục mua hàng
      </a>
    </div>
  );
}

export default OrderInfo;
