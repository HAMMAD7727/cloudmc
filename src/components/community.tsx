
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

  if (isUserLoading) {
    return (
      <div id="community" className="w-full py-12 md:py-20 flex justify-center items-center">
        <p>Loading Community Hub...</p>
      </div>
    );
  }

  return (
    <section id="community" className="w-full py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
            Community Hub
          </h2>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Connect with other players, get support, and stay engaged with the
            Cloudverse community.
          </CardDescription>
        </div>

        <Card className="mt-6 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Global Chat</CardTitle>
            <CardDescription>
              Chat with other players online right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LiveChat />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
