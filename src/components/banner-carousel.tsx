import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BANNER_COLLECTION } from "@/lib/pocketbase";
import { convertImageUrl } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

interface BannerCarouselProps {
  banners: any[];
}

function BannerCarousel({ banners }: BannerCarouselProps) {
  if (!banners?.length) return;

  return (
    <Carousel
      className="group"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent className="">
        {banners?.map((item, index) => (
          <CarouselItem key={index} className="select-none">
            <a href={item?.url}>
              <img
                loading="lazy"
                src={convertImageUrl(BANNER_COLLECTION, item?.id, item?.image)}
                alt=""
                className="h-56 lg:h-[380px] w-full object-cover"
              />
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden group-hover:flex left-2 border-none lg:left-80" />
      <CarouselNext className="hidden group-hover:flex right-2 border-none lg:right-80" />
    </Carousel>
  );
}

export default BannerCarousel;
