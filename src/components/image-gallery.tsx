import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ImageGalleryProps {
  images?: string[];
}

function ImageGallery({ images }: ImageGalleryProps) {
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
    <div className="flex flex-col-reverse lg:flex-row gap-2">
      <div className="flex lg:flex-col gap-1">
        {images?.map((item, index) => (
          <div
            onMouseEnter={() => handleClick(index)}
            key={index}
            className={cn(
              "w-14 h-14 cursor-pointer border-2 border-transparent rounded-md overflow-hidden",
              index == current ? " border-blue-500" : ""
            )}
          >
            <img
              className="w-full object-cover hover:scale-105 transition-all duration-150"
              src={item}
              alt=""
            />
          </div>
        ))}
      </div>
      <div className="flex-1 h-[600px]">
        <div className="rounded-lg overflow-hidden">
          <Carousel setApi={setApi}>
            <CarouselContent>
              {images?.map((item, index) => (
                <CarouselItem key={index}>
                  <img className="w-full object-cover" src={item} alt="" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
