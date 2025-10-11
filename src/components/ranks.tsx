import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Shield, Gem, Star, Crown, Sparkles } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { cn } from "@/lib/utils";

const ranks = [
  { name: 'Warrior', price: 30, perks: ['Basic server perks', 'Access to /kit warrior', 'Colored chat'], icon: Shield, color: "text-slate-500" },
  { name: 'Champion', price: 70, perks: ['All Warrior perks', 'Access to /kit champion', 'Custom nick color', '2 home locations'], icon: Gem, color: "text-cyan-500" },
  { name: 'Titan', price: 180, perks: ['All Champion perks', 'Access to /kit titan', 'Custom join messages', '5 home locations', 'Access to /fly'], icon: Star, color: "text-amber-500" },
  { name: 'King', price: 350, bonus: '+ 1,000 coins', perks: ['All Titan perks', 'Access to /kit king', 'Custom particle effects', '10 home locations', 'Priority server access'], icon: Crown, color: "text-fuchsia-500" },
  { name: 'Legend', price: 450, bonus: '+ 2,500 coins', perks: ['All King perks', 'Access to /kit legend', 'Custom armor trails', 'Unlimited home locations', 'Access to beta features', 'Monthly bonus rewards'], bestValue: true, icon: Sparkles, color: "text-red-500" },
];

export function Ranks() {
  return (
    <section id="ranks" className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Server Ranks</h2>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Upgrade your rank to unlock powerful perks and show your support!
          </CardDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {ranks.map((rank) => (
            <Card key={rank.name} className={cn("flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl", rank.bestValue && "border-accent ring-2 ring-accent shadow-accent/20")}>
              {rank.bestValue && (
                <Badge className="absolute -top-3 right-3 bg-accent text-accent-foreground hover:bg-accent/90" >BEST VALUE</Badge>
              )}
              <CardHeader className="items-center text-center">
                <rank.icon className={cn("w-12 h-12 mb-2", rank.color)} />
                <CardTitle className="text-2xl font-headline">{rank.name}</CardTitle>
                <p className="text-3xl font-semibold text-foreground">₹{rank.price}</p>
                {rank.bonus && <p className="text-sm font-medium text-green-600">{rank.bonus}</p>}
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {rank.perks.map((perk) => (
                    <li key={perk} className="flex items-start">
                      <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>
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
