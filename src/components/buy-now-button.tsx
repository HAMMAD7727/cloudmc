
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTabStore } from "@/lib/tab-store";

export function BuyNowButton({ className, ...props }: ButtonProps) {
  const { setMainTab, setCommunityTab } = useTabStore();

  const handleClick = () => {
    setMainTab("community");
    setCommunityTab("support");
  };

  return (
    <Button
      onClick={handleClick}
      className={cn("w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-200 hover:scale-105", className)}
      {...props}
    >
        Buy Now
    </Button>
  );
}
