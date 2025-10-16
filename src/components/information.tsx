
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Information() {
  return (
    <section id="information" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">
            🛸 CloudVerse Media Rank Requirements 🛸
          </h2>
          <CardDescription className="max-w-3xl mx-auto !text-lg">
            Requirements and perks for content creators on CloudVerse.
          </CardDescription>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader>
              <CardTitle>
                🎄 Platform Focus: YouTube (Primary)
              </CardTitle>
               <CardDescription>
                Alternate Platforms: TikTok, Twitch, Instagram Reels, Kick
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg text-foreground">🎈 Requirements 🎈</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>Minimum 200 subscribers</li>
                        <li>At least 1 recent video showcasing CloudVerse (uploaded within the last 30 days)</li>
                        <li>
                            The video must:
                            <ul className="list-disc list-inside ml-6 space-y-1">
                                <li>Include server IP in the description</li>
                                <li>Feature gameplay or highlights from CloudVerse</li>
                                <li>Be at least 2 minutes long</li>
                                <li>Have clean, family-friendly content</li>
                            </ul>
                        </li>
                        <li>Minimum 150 average views per video</li>
                        <li>Must upload CloudVerse-related content at least once every weeks to keep the rank</li>
                    </ul>
                </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
            <CardHeader>
              <CardTitle>🌍 Alternate Platform Requirements 🗺</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                    <h3 className="font-semibold text-lg text-foreground">🍒 TikTok / Instagram Reels:</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>Minimum 1,000 followers</li>
                        <li>CloudVerse clip must reach 500 views or more on average</li>
                        <li>Must post atleast 1 CloudVerse-related clip every 2 weeks</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-foreground">💫 Twitch / Kick:</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
                        <li>Minimum 150 followers</li>
                        <li>Average of 100+ viewers per Minecraft stream</li>
                        <li>Must stream CloudVerse at least twice per week</li>
                    </ul>
                </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <CardHeader>
              <CardTitle>🎭 Perks of Media Rank</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
                 <ul className="list-disc list-inside space-y-2">
                    <li>Exclusive [Media] tag in-game and on Discord</li>
                    <li>Early access to server updates and beta features</li>
                    <li>Host monthly giveaway for temporary ranks</li>
                    <li>Permission to host or record events with</li>
                    <li>Access to the Media Lounge (Discord exclusive)</li>
                </ul>
            </CardContent>
          </Card>
          
           <Card className="border-destructive/50 transition-all duration-300 hover:shadow-2xl hover:shadow-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">💣 Maintenance & Removal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
                 <ul className="list-disc list-inside space-y-2">
                    <li>Inactivity for over 4 weeks leads to temporary removal</li>
                    <li>Failure to meet requirements after warning can result in rank loss</li>
                    <li>Re-application allowed after 2 weeks of meeting requirements again</li>
                </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
