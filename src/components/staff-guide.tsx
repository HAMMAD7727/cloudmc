
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function StaffGuide() {
  return (
    <section id="staff-guide" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Staff Guide</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Welcome to the official Cloudverse Staff Guide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none mx-auto text-muted-foreground">
              <p>This guide provides essential information and procedures for all staff members. Please read it carefully and refer to it whenever you are unsure about a process.</p>
              
              <h3 className="text-foreground">General Conduct</h3>
              <ul>
                <li>Always be respectful to players and fellow staff members.</li>
                <li>Maintain a professional and helpful attitude.</li>
                <li>Do not abuse your powers. Use them only when necessary and as instructed.</li>
              </ul>

              <h3 className="text-foreground">Handling Player Reports</h3>
              <p>When a player reports an issue, follow these steps:</p>
              <ol>
                <li>Acknowledge the report in the appropriate channel.</li>
                <li>Investigate the issue by gathering evidence (screenshots, logs).</li>
                <li>Take appropriate action based on server rules (e.g., warning, mute, ban).</li>
                <li>Document the action taken in the staff logs.</li>
              </ol>

              <h3 className="text-foreground">Handling Purchases</h3>
              <p>When a player creates a ticket to make a purchase:</p>
              <ol>
                <li>Respond to the ticket promptly.</li>
                <li>Confirm the item(s) they wish to purchase.</li>
                <li>Provide them with the payment details.</li>
                <li>Once payment is confirmed, manually issue the rank/items in-game.</li>
                <li>Close the ticket and thank the player for their support.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
