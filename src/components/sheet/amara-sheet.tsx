import { forwardRef, useImperativeHandle, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

interface AmaraSheetProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  button?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  showClose?: boolean;
  disableOutside?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const AmaraSheet = forwardRef(
  (
    {
      button,
      title,
      children,
      description,
      icon,
      className,
      showClose,
      disableOutside = false,
      onOpen,
      onClose,
    }: AmaraSheetProps,
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        onOpen?.();
      },
      close: () => {
        setIsOpen(false);
        onClose?.();
      },
    }));

    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {button && <SheetTrigger asChild>{button}</SheetTrigger>}
        <SheetContent
          className={cn("flex w-full flex-col gap-0 p-0", className)}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={
            disableOutside ? (e) => e.preventDefault() : undefined
          }
          showClose={showClose}
        >
          <SheetHeader className="flex w-full flex-row items-center gap-4 space-y-0 border-b px-6 py-4">
            {icon && (
              <span className="border-pro-snow-200 flex size-12 shrink-0 grow-0 items-center justify-center rounded-[10px] border [&_svg]:size-6">
                {icon}
              </span>
            )}

            <div className="flex w-full flex-col gap-1">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription
                className={`${description ? "text-pro-gray-200" : "sr-only"} line-clamp-1`}
              >
                {description}
              </SheetDescription>
            </div>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  },
);

AmaraSheet.displayName = "AmaraSheet";

export default AmaraSheet;
