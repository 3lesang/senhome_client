import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { API_URL, BANNER_COLLECTION, pb } from "@/lib/pocketbase";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";

function BannerCarousel() {
  const client = useStore(queryClient);

  const bannersQuery = useSuspenseQuery(
    {
      queryKey: [BANNER_COLLECTION],
      queryFn: () =>
        pb.collection(BANNER_COLLECTION).getFullList({ perPage: 5 }),
    },
    client
  );

  const banners = bannersQuery.data;

  if (!banners?.length) return;

  return (
    <Carousel
      className=""
      plugins={[
        Autoplay({
          delay: 10000,
        }),
      ]}
    >
      <CarouselContent className="">
        {banners?.map((item, index) => (
          <CarouselItem key={index} className="select-none">
            <a href="/product">
              <img
                loading="lazy"
                src={`${API_URL}/api/files/banners/${item?.id}/${item?.image}`}
                alt=""
                className="h-96 w-full object-cover"
              />
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-none left-80" />
      <CarouselNext className="border-none right-80" />
    </Carousel>
  );
}

export default BannerCarousel;
