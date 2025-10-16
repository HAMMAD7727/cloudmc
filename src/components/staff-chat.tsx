
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export function StaffChat() {
  return (
    <section id="staff-chat" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Staff Chat</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              This is a private chat area for staff members only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-lg flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Staff chat functionality coming soon!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
