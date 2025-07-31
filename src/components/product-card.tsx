import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRODUCT_COLLECTION } from "@/lib/pocketbase";
import { convertImageUrl, formatVND } from "@/lib/utils";
import { addToCart } from "@/stores/cart";
import { PlusIcon } from "lucide-react";
import { toast } from "./toast";

interface ProductCardProps {
  id: string;
  thumbnail: string;
  name: string;
  price: number;
  discount: number;
  slug: string;
}

function ProductCard(item: ProductCardProps) {
  const { id, name, price = 0, thumbnail, discount, slug } = item;
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart({
      id,
      name,
      price,
      discount,
      thumbnail,
      slug,
      quantity: 1,
      selected: true,
    });
    toast(
      <div className="bg-white shadow py-2 px-4 rounded-md">
        Đã thêm sản phẩm vào giỏ hàng
        <a
          href="/gio-hang"
          className="cursor-pointer ml-2 font-bold hover:underline"
        >
          Xem giỏ hàng
        </a>
      </div>
    );
  };

  return (
    <Card className="rounded-md border-none shadow-none overflow-hidden group">
      <div className="rounded-md overflow-hidden relative">
        <img
          src={convertImageUrl(PRODUCT_COLLECTION, id, thumbnail)}
          loading="lazy"
          decoding="async"
          height={100}
          alt="product_image"
          className="aspect-square w-full bg-gray-200 object-cover group-hover:scale-105 xl:aspect-1/1 transition-all duration-300 ease-in-out"
        />
        <div className="bottom-4 right-4 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <Button className="cursor-pointer" onClick={handleAddToCart}>
            <PlusIcon />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <p className="line-clamp-2 group-hover:text-gray-600">{name}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-lg font-bold">
          {formatVND(price - price * (discount || 0))}
        </p>
        {discount ? (
          <Badge className="font-bold">-{discount * 100}%</Badge>
        ) : null}
        {discount ? (
          <p className="text-gray-500 line-through">{formatVND(price)}</p>
        ) : null}
      </div>
    </Card>
  );
}

export default ProductCard;
