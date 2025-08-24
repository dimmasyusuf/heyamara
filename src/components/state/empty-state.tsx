import Image, { type StaticImageData } from "next/image";

import EmptyImage from "@/assets/image/empty.png";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  image?: string | StaticImageData;
  children?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  image = EmptyImage,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <Image
        src={image}
        alt={title}
        width={291}
        height={400}
        className="h-48 w-fit"
      />

      <div className="flex max-w-96 flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          {title && <h6 className="text-center font-semibold">{title}</h6>}
          {description && (
            <p
              className="text-pro-gray-200 text-center text-sm"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
