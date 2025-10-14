
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Trophy, TrendingUp, ThumbsUp, Vote } from "lucide-react";
import Link from "next/link";

const voteLinks = [
  { name: "Planet Minecraft", url: "https://www.planetminecraft.com/server/cloudverse-6734379/vote/" },
  { name: "Minecraft Server List", url: "https://minecraft-server-list.com/server/514928/vote/" },
  { name: "Minecraft-MP", url: "https://minecraft-mp.com/server/348959/vote/" },
  { name: "MinecraftServers.org", url: "https://minecraftservers.org/server/678938/" },
  { name: "TopG", url: "https://topg.org/minecraft-servers/server-676010" },
];

export function Voting() {
  return (
    <section id="voting" className="w-full py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
            Vote for Cloudverse
          </h2>
          <CardDescription className="max-w-3xl mx-auto !text-base">
            Help our server grow and get awesome rewards in return! Every vote
            counts and makes a huge difference. For in-game rewards, type{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded-sm">/vote</code> in the chat!
          </CardDescription>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-primary/20 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <Vote className="w-6 h-6 text-primary" />
                How to Vote
              </CardTitle>
              <CardDescription>
                Follow these simple steps to cast your vote.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">1</div>
                <p>Click on any of the links from the list.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">2</div>
                <p>Enter your exact Minecraft username.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">3</div>
                <p>Complete the CAPTCHA if prompted.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold">4</div>
                <p>Hit the "Vote" button and you're done!</p>
              </div>
            </CardContent>
            <CardFooter>
                 <p className="text-sm text-muted-foreground">
                    Tip: Look for a sign or button at the corner of each site to confirm your vote.
                 </p>
            </CardFooter>
          </Card>
          
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-accent/20 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <ThumbsUp className="w-6 h-6 text-accent" />
                Why Vote?
              </CardTitle>
              <CardDescription>
                Your vote has a real impact on the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-start gap-4">
                <TrendingUp className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                <div>
                    <h4 className="font-semibold">Boost Our Server</h4>
                    <p className="text-muted-foreground">Help Cloudverse climb the ranks and attract new players.</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Rocket className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                 <div>
                    <h4 className="font-semibold">Unlock In-Game Rewards</h4>
                    <p className="text-muted-foreground">Receive exclusive items, currency, and bonuses for your support.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Trophy className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                 <div>
                    <h4 className="font-semibold">Become Voter of the Month</h4>
                    <p className="text-muted-foreground">Compete for a special role and recognition on our Discord server.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Voting Links</CardTitle>
            <CardDescription>
              Click a link below to go to the voting site. Each site allows one
              vote per day.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {voteLinks.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="justify-start"
              >
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">{index + 1}</span>
                  <span className="truncate">{link.name}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

