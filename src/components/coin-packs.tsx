import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BuyNowButton } from "./buy-now-button";
import { Coins } from "lucide-react";

const coinPacks = [
  { name: 'Starter Pack', coins: 500, price: 50, description: 'Perfect for beginners!' },
  { name: 'Value Pack', coins: 1200, price: 100, description: '20% bonus coins included!', popular: true },
  { name: 'Premium Pack', coins: 2500, price: 200, description: '25% bonus coins included!' },
  { name: 'Elite Pack', coins: 5000, price: 400, description: '25% bonus coins + exclusive pet!' },
];

export function CoinPacks() {
  return (
    <section id="coins" className="w-full py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Buy Coins</h2>
          <p className="text-muted-foreground text-lg">100 Coins = ₹10</p>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Purchase coins to unlock special items and perks in the game!
          </CardDescription>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coinPacks.map((pack) => (
            <Card key={pack.name} className="flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl">
              {pack.popular && (
                <Badge className="absolute -top-3 right-3 bg-primary text-primary-foreground">MOST POPULAR</Badge>
              )}
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl font-headline">{pack.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-yellow-500">
                  <Coins className="w-10 h-10" />
                  <p className="text-5xl font-bold">{pack.coins}</p>
                </div>
                <p className="text-3xl font-semibold text-foreground">₹{pack.price}</p>
                <CardDescription>{pack.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <BuyNowButton />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
