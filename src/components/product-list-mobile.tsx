import CartProductItemMobile from "./cart-product-item-mobile";

interface ProductListMobileProps {
  data?: any;
}
function ProductListMobile({ data }: ProductListMobileProps) {
  return (
    <div className="space-y-4">
      {data?.map((item: any) => (
        <CartProductItemMobile data={item} />
      ))}
    </div>
  );
}

export default ProductListMobile;
