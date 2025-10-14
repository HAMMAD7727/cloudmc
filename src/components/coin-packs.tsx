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
    <section id="coins" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Buy Coins</h2>
          <p className="text-muted-foreground text-lg">100 Coins = ₹10</p>
          <CardDescription className="max-w-2xl mx-auto !text-lg">
            Purchase coins to unlock special items and perks in the game!
          </CardDescription>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coinPacks.map((pack, index) => (
            <Card key={pack.name} className="flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
              {pack.popular && (
                <Badge className="absolute -top-3 right-3 bg-primary text-primary-foreground border-2 border-background">MOST POPULAR</Badge>
              )}
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl font-bold">{pack.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <Coins className="w-10 h-10" />
                  <p className="text-6xl font-bold">{pack.coins}</p>
                </div>
                <p className="text-4xl font-bold text-foreground">₹{pack.price}</p>
                <CardDescription className="text-base">{pack.description}</CardDescription>
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
