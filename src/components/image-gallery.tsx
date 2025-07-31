import { cn } from "@/lib/utils";
import { useState } from "react";

const images = [
  "https://b0m772h91854471.pocketbasecloud.com/api/files/products/uq2t191uhfk9e9f/v1_393439440908352_uhicnq8iiy.avif",
  "https://b0m772h91854471.pocketbasecloud.com/api/files/products/0s9k7l5t800yh3m/168793578898856862_cut4rhea3q.avif",
];

function ImageGallery() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-1">
        {images.map((item, index) => (
          <div
            onMouseEnter={() => setCurrent(index)}
            key={index}
            className={cn(
              "cursor-pointer border-2 border-transparent rounded-md overflow-hidden",
              index == current ? " border-blue-500" : ""
            )}
          >
            <img className="w-14 object-cover" src={item} alt="" />
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="rounded-lg overflow-hidden">
          <img className="w-full object-cover" src={images[current]} alt="" />
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
