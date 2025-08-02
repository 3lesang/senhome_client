import type { OrderItemType } from "@/components/order-form";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatVND } from "@/lib/utils";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface OrderItemTable {
  data?: OrderItemType[];
  value?: OrderItemType[];
  onChange?: (data: OrderItemType[]) => void;
}

function OrderItemTable({ data, onChange }: OrderItemTable) {
  const [values, setValues] = useState(data);

  const handleToggleSelectAll = () => {
    const isAllSelected = values?.every((item) => item.selected);
    const updated = values?.map((item) => ({
      ...item,
      selected: !isAllSelected,
    }));
    setValues(updated);
    onChange?.(updated || []);
  };

  const getCheckedType = (): CheckedState | undefined => {
    const total = values?.length;
    const selected = values?.filter((item) => item.selected).length;
    if (selected === 0) return false;
    if (selected === total) return true;
    return "indeterminate";
  };

  const checked = getCheckedType();

  const handleDeleteSelect = () => {
    const updated = values?.filter((item) => !item.selected);
    setValues(updated);
    onChange?.(updated || []);
  };

  const handleSelectItem = (id: string) => {
    const updated = values?.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setValues(updated);
    onChange?.(updated || []);
  };

  const handleDeleteItem = (id: string) => {
    const updated = values?.filter((item) => item.id !== id);
    setValues(updated);
    onChange?.(updated || []);
  };

  const incrementItemQuantity = (id: string) => {
    const updated = values?.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setValues(updated);
    onChange?.(updated || []);
  };

  const decrementItemQuantity = (id: string) => {
    const updated = values?.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setValues(updated);
    onChange?.(updated || []);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">
            <div className="flex items-center gap-2">
              <Checkbox
                className="cursor-pointer"
                checked={checked}
                onCheckedChange={handleToggleSelectAll}
              />
              <span>Tất cả sản phẩm</span>
            </div>
          </TableHead>
          <TableHead>Đơn giá</TableHead>
          <TableHead>Số lượng</TableHead>
          <TableHead className="text-right">Thành tiền</TableHead>
          <TableHead className="text-right">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  <Trash2Icon />
                  Xóa đã chọn
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Xóa tất cả sản phẩm</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="mr-2 cursor-pointer">
                      Hủy
                    </Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      className={cn(buttonVariants(), "cursor-pointer")}
                      onClick={handleDeleteSelect}
                    >
                      Xóa tất cả
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {values?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-4">
                <Checkbox
                  className="cursor-pointer"
                  checked={item.selected}
                  onCheckedChange={() => handleSelectItem(item.id)}
                />
                <img
                  className="h-12 w-12 object-cover rounded-md"
                  src=""
                  alt={item.name}
                />
                <a className="hover:underline" href={`/san-pham/${item.slug}`}>
                  {item.name}
                </a>
              </div>
            </TableCell>
            <TableCell>
              <p className="font-bold select-none text-center">
                {formatVND(item.price - item.price * (item.discount || 0))}
              </p>
              {item.discount ? (
                <div className="flex items-center justify-center gap-2">
                  <Badge className="font-bold">-{item.discount * 100}%</Badge>
                  <p className="text-gray-500 line-through text-center">
                    {formatVND(item.price)}
                  </p>
                </div>
              ) : null}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={item.quantity <= 1}
                  onClick={() => decrementItemQuantity(item.id)}
                >
                  <MinusIcon />
                </Button>
                <div
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "select-none text-center"
                  )}
                >
                  {item.quantity}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={item.quantity >= 99}
                  onClick={() => incrementItemQuantity(item.id)}
                >
                  <PlusIcon />
                </Button>
              </div>
            </TableCell>
            <TableCell className="">
              <p className="font-bold select-none text-center">
                {formatVND(
                  (item.price - item.price * (item.discount || 0)) *
                    item.quantity
                )}
              </p>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2Icon />
                Xóa
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrderItemTable;
