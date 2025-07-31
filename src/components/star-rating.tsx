import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({
  rating = 0,
  max = 5,
  onChange,
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const value = index + 1;
        const filled = hovered !== null ? value <= hovered : value <= rating;

        return (
          <button
            key={value}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHovered(value)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            onClick={() => !readOnly && onChange?.(value)}
            className={cn(
              "transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
          >
            <Star
              size={16}
              className={
                filled ? "text-blue-500 fill-blue-500" : "text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
