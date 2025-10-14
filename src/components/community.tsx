
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LiveChat } from "./live-chat";
import { useUser } from "@/firebase";

export function Community() {
  const { isUserLoading } = useUser();

  return (
    <section id="community" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">
            Community Hub
          </h2>
          <CardDescription className="max-w-2xl mx-auto !text-lg">
            Connect with other players, get support, and stay engaged with the
            Cloudverse community.
          </CardDescription>
        </div>

        <Card className="mt-6 max-w-4xl mx-auto transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader>
            <CardTitle>Global Chat</CardTitle>
            <CardDescription>
              Chat with other players online right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isUserLoading ? (
               <div className="flex justify-center items-center h-96">
                <p>Loading Community Hub...</p>
               </div>
             ) : (
              <LiveChat />
             )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
