"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function BuyNowButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      asChild
      className={cn("w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-transform duration-200 hover:scale-105", className)}
      {...props}
    >
      <Link href="/#support">
        Buy Now
      </Link>
    </Button>
  );
}
