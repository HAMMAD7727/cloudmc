
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CoinPacks } from "@/components/coin-packs";
import { Ranks } from "@/components/ranks";
import { Features } from "@/components/features";
import { News } from "@/components/news";
import { HomeContent } from "@/components/home-content";
import { Feedback } from "@/components/feedback";
import { Staff } from "@/components/staff";
import { Community } from "@/components/community";
import { useTabStore } from "@/lib/tab-store";
import { TermsDialog } from "@/components/terms-dialog";
import { PrivacyDialog } from "@/components/privacy-dialog";

export default function Home() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'cloudverse-banner');
  const { mainTab, setMainTab } = useTabStore();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="relative w-full h-64 md:h-80">
        {bannerImage && (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={bannerImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
          <div className="bg-black/20 backdrop-blur-md p-6 rounded-xl">
            {bannerImage &&
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-full mb-4 transition-transform duration-300 hover:scale-110">
                <Image src={bannerImage.imageUrl} alt="Cloudverse Logo" width={80} height={80} className="rounded-full" data-ai-hint={bannerImage.imageHint}/>
              </div>
            }
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-headline drop-shadow-lg">
              Cloudverse Store
            </h1>
            <p className="mt-2 text-md md:text-lg text-white/90 drop-shadow-md max-w-xs sm:max-w-none">
              Your one-stop shop for ranks, coins, and more!
            </p>
          </div>
          <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground group transition-transform duration-300 hover:scale-105" size="lg">
            <Link href="https://discord.gg/UNaPb7SYyf" target="_blank">
              <svg className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.36981C18.699 3.50425 16.962 2.86175 15.129 2.49881C14.991 2.74281 14.833 3.00381 14.695 3.25081C12.793 2.92481 10.993 2.92481 9.125 3.25081C8.987 3.00381 8.829 2.74281 8.691 2.49881C6.858 2.86175 5.122 3.50425 3.504 4.36981C0.375 8.05381 -0.422 11.5948 0.171 15.0608C1.832 16.2648 3.543 17.1358 5.263 17.7598C5.552 17.2628 5.808 16.7498 6.031 16.2238C5.293 15.9078 4.582 15.5418 3.903 15.1158C4.011 15.0118 4.115 14.9038 4.218 14.7958C7.599 16.6328 11.428 17.4768 15.129 17.7598C15.352 16.7498 15.556 15.7258 15.728 14.6968C15.556 14.6438 15.385 14.5918 15.213 14.5378C15.042 14.4848 14.877 14.4268 14.706 14.3688C14.535 14.3108 14.37 14.2478 14.205 14.1848C11.353 13.5288 9.032 11.9698 9.032 11.9698C9.032 11.9698 9.448 12.4498 10.027 12.8648C10.046 12.8758 10.065 12.8878 10.084 12.8998C12.394 14.1458 14.57 14.6018 16.632 14.7958C16.74 14.9038 16.843 15.0118 16.942 15.1158C16.263 15.5418 15.552 15.9078 14.814 16.2238C15.037 16.7498 15.293 17.2628 15.582 17.7598C17.302 17.1358 18.992 16.2648 20.653 15.0608C21.284 11.2388 20.317 7.71181 20.317 4.36981ZM8.021 12.3368C7.023 12.3368 6.206 11.4748 6.206 10.4208C6.206 9.36681 7.011 8.50481 8.021 8.50481C9.031 8.50481 9.847 9.36681 9.838 10.4208C9.838 11.4748 9.031 12.3368 8.021 12.3368ZM15.808 12.3368C14.81 12.3368 13.993 11.4748 13.993 10.4208C13.993 9.36681 14.799 8.50481 15.808 8.50481C16.818 8.50481 17.635 9.36681 17.626 10.4208C17.626 11.4748 16.818 12.3368 15.808 12.3368Z" /></svg>
              Join our Discord
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="container mx-auto h-14 rounded-none bg-transparent p-0 grid w-full grid-cols-8 sm:inline-flex">
                <TabsTrigger value="home" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Home</TabsTrigger>
                <TabsTrigger value="coins" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Coins</TabsTrigger>
                <TabsTrigger value="ranks" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Ranks</TabsTrigger>
                <TabsTrigger value="features" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Features</TabsTrigger>
                <TabsTrigger value="news" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">News</TabsTrigger>
                <TabsTrigger value="community" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Community</TabsTrigger>
                <TabsTrigger value="feedback" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Feedback</TabsTrigger>
                <TabsTrigger value="staff" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-base transition-colors duration-300 hover:bg-primary/5">Staff</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <TabsContent value="home" className="mt-0">
            <HomeContent />
          </TabsContent>
          <TabsContent value="coins" className="mt-0">
            <CoinPacks />
          </TabsContent>
          <TabsContent value="ranks" className="mt-0">
            <Ranks />
          </TabsContent>
          <TabsContent value="features" className="mt-0">
            <Features />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <News />
          </TabsContent>
          <TabsContent value="community" className="mt-0">
            <Community />
          </TabsContent>
          <TabsContent value="feedback" className="mt-0">
            <Feedback />
          </TabsContent>
          <TabsContent value="staff" className="mt-0">
            <Staff />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="bg-primary/5 border-t">
        <div className="container mx-auto py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cloudverse. All rights reserved.</p>
          <p className="text-sm">This is a fan-made store and not affiliated with Mojang AB.</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Button variant="link" asChild className="text-xs text-muted-foreground/50">
              <Link href="/admin">Admin Panel</Link>
            </Button>
            <TermsDialog />
            <PrivacyDialog />
          </div>
        </div>
      </footer>
    </div>
  );
}
