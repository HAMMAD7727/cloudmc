"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BuyNowButton({ className, ...props }: ButtonProps) {
  const handlePurchase = () => {
    window.open("/purchase", "_blank");
  };

  return (
    <Button
      onClick={handlePurchase}
      className={cn("w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-200 hover:scale-105", className)}
      {...props}
    >
      Buy Now
    </Button>
  );
}
