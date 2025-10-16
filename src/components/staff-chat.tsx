
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { LiveChat } from "./live-chat";

export function StaffChat({ onBack }: { onBack: () => void }) {
  return (
    <section id="staff-chat" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4"/>
          Back to Dashboard
        </Button>
        <Card className="max-w-4xl mx-auto">
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
