import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { galleryAtom } from "@/stores/gallery";
import { useEffect, useState } from "react";

interface ImageGalleryProps {
  data?: any[];
}

const ImageGallery = ({ data }: ImageGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="space-y-2">
      <Carousel
        setApi={(api) => {
          galleryAtom.set({ api, data });
          return setApi(api);
        }}
      >
        <CarouselContent>
          {data?.map((item, index) => (
            <CarouselItem key={index}>
              <img className="w-full object-cover rounded" src={item.image} alt="" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="space-x-2">
        {data?.map((item, index) => (
          <div
            onMouseEnter={() => handleClick(index)}
            key={index}
            className={cn(
              "w-20 h-20 rounded cursor-pointer border-2 border-transparent overflow-hidden inline-block",
              index == current ? " border-blue-500" : ""
            )}
          >
            <img
              className="w-full object-cover hover:scale-105 transition-all duration-150"
              src={item.image}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
