import Image, { StaticImageData } from "next/image";

import Duck from "@/assets/image/duck.png";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  image?: StaticImageData;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  image = Duck,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <Image src={image} alt={title} width={208} height={208} />

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h6 className="text-lg font-bold sm:text-2xl">{title}</h6>
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
