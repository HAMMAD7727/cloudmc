
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Brush } from "lucide-react";

const effects = [
  {
    name: "Glow",
    description: "Adds a soft glow/shadow when hovered",
    className: "hover:shadow-lg hover:shadow-primary/50",
  },
  {
    name: "Zoom In",
    description: "Element slightly grows",
    className: "hover:scale-105 transition-transform",
  },
  {
    name: "Zoom Out",
    description: "Element slightly shrinks",
    className: "hover:scale-95 transition-transform",
  },
  {
    name: "Rotate",
    description: "Slight rotation effect",
    className: "hover:rotate-3 transition-transform",
  },
  {
    name: "Lift Up",
    description: "Moves up a little",
    className: "hover:-translate-y-1 transition-transform",
  },
  {
    name: "Tilt",
    description: "Tilts sideways",
    className: "hover:rotate-[-2deg] transition-transform",
  },
  {
    name: "Fade In",
    description: "Fades opacity to 100%",
    className: "opacity-75 hover:opacity-100 transition-opacity",
  },
  {
    name: "Fade Out",
    description: "Reduces opacity",
    className: "hover:opacity-70 transition-opacity",
  },
  {
    name: "Color Change",
    description: "Changes background color",
    className: "hover:bg-accent transition-colors",
  },
  {
    name: "Border Highlight",
    description: "Adds border or glow on hover",
    className: "hover:border-primary border-2 border-transparent transition-all",
  },
  {
    name: "Pulse",
    description: "Gently pulses (animated)",
    className: "animate-pulse hover:animate-none",
  },
  {
    name: "Shadow Pop",
    description: "Lifts with big shadow",
    className: "hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
  },
  {
    name: "Glow Neon",
    description: "Neon-like border or text",
    className: "hover-glow-neon transition-all duration-300",
  },
  {
    name: "Slide Right",
    description: "Moves slightly to right",
    className: "hover:translate-x-1 transition-transform",
  },
  {
    name: "Rotate 360°",
    description: "Spins fully",
    className: "hover:rotate-[360deg] transition-transform duration-500",
  },
];

export function HoverEffectsGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Brush className="mr-2 h-4 w-4" /> Hover Effects
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            CSS Hover Effects Guide
          </DialogTitle>
          <DialogDescription>
            Hover over the cards below to see a live preview of each effect.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {effects.map((effect) => (
              <div key={effect.name} className="flex flex-col items-center gap-4">
                <Card
                  className={cn(
                    "w-full h-32 flex items-center justify-center text-center p-4",
                    effect.className
                  )}
                >
                  <p className="text-lg font-semibold">Hover Me</p>
                </Card>
                <div className="text-center">
                  <h3 className="font-semibold">{effect.name}</h3>
                  <p className="text-sm text-muted-foreground">{effect.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
