
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, MessageSquare, Users } from "lucide-react";
import Link from "next/link";


export function HomeContent() {

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Welcome to the official Cloudverse Store</h2>
            <p className="text-lg text-muted-foreground">
              Cloudverse is a free-to-play Public Minecraft Server. This is the official store where you can purchase ranks, coins, and other items to enhance your gameplay experience and grant you special perks.
            </p>
             <Card className="transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-primary/20 hover:shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        All payments are final and non-refundable. Attempting a chargeback or opening a PayPal dispute will result in permanent and irreversible banishment from all of our servers, and other Minecraft stores.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        All purchases are handled by staff through our official Discord server.
                    </p>
                </CardContent>
             </Card>
          </div>
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-accent/20 hover:shadow-2xl bg-accent/10 border-accent/50">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full w-fit mb-2">
                <ShoppingCart className="w-8 h-8 text-accent-foreground"/>
              </div>
              <CardTitle className="font-headline text-2xl text-accent-foreground">How to Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                To buy an item, please join our Discord server and create a ticket. Our staff will contact you to handle the payment and delivery of your items in-game.
              </p>
              <Button asChild className="w-full">
                <Link href="https://discord.gg/UNaPb7SYyf" target="_blank">
                  <Users className="mr-2"/>
                  Join our Community
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
