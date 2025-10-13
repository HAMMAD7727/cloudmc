"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveChat } from "./live-chat";
import { SupportTickets } from "./support-tickets";
import { useUser } from "@/firebase";

export function Community() {
  const { user, isUserLoading } = useUser();
  const [activeTab, setActiveTab] = useState("live-chat");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#support') {
      setActiveTab('support');
    } else if (hash === '#live-chat') {
      setActiveTab('live-chat');
    }
  }, []);


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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="live-chat" onClick={() => window.location.hash = 'live-chat'}>Live Chat</TabsTrigger>
            <TabsTrigger value="support" onClick={() => window.location.hash = 'support'}>Support Tickets</TabsTrigger>
          </TabsList>
          <TabsContent value="live-chat" id="live-chat">
            <Card className="mt-6">
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
          </TabsContent>
          <TabsContent value="support" id="support">
             <Card className="mt-6">
              <CardHeader>
                <CardTitle>Support & Purchases</CardTitle>
                <CardDescription>
                  Need help or want to buy an item? Create a ticket and our staff will assist you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupportTickets />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
