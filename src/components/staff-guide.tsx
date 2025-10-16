
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

export function StaffGuide({ onBack }: { onBack: () => void }) {
  return (
    <section id="staff-guide" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4"/>
          Back to Dashboard
        </Button>
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Admin Panel Guide</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Your guide to managing the Cloudverse webstore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none mx-auto text-muted-foreground space-y-6">
              <div>
                <h3 className="text-foreground">Admin Panel Overview</h3>
                <p>The website has several admin panels, each controlling a different section of the store. To access them, you must first navigate to the correct tab on the homepage, and then use the "Admin Login" button that appears in the top-right corner.</p>
              </div>

              <div>
                <h3 className="text-foreground">Admin Panels & Passwords</h3>
                <ul className="space-y-2">
                  <li><strong>Ranks Admin:</strong> Go to the "Ranks" tab. Password: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-foreground">hammadisjassi</code></li>
                  <li><strong>Features Admin:</strong> Go to the "Features" tab. Password: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-foreground">hammadisjassi</code></li>
                  <li><strong>News Admin:</strong> Go to the "News" tab. Password: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-foreground">hammadisjassi</code></li>
                  <li><strong>Staff Admin:</strong> Go to the "Staff" tab. Password: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-foreground">cloudmcstaff</code></li>
                   <li><strong>Main Admin Dashboard:</strong> Go to <a href="/admin">/admin</a>. Password: <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-foreground">hammadisjassi</code></li>
                </ul>
              </div>

              <div>
                <h3 className="text-foreground">Website Tabs Explained</h3>
                 <dl className="space-y-4">
                    <div>
                        <dt className="font-semibold text-foreground">Home:</dt>
                        <dd>The main landing page with general information and refund policies.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Coins:</dt>
                        <dd>A static page displaying coin packages. Purchases are handled via Discord.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Ranks:</dt>
                        <dd>Dynamically displays server ranks from the database. Admins can add, edit, and delete ranks.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Features:</dt>
                        <dd>Dynamically displays special feature packages. Admins can manage these features.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">News:</dt>
                        <dd>Shows the latest server news and updates. Admins can post new articles.</dd>
                    </div>
                    <div>
                        <dt className="font-semibold text-foreground">Community:</dt>
                        <dd>Contains the global live chat for all logged-in players.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Voting:</dt>
                        <dd>Provides links for players to vote for the server on various listing sites.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Feedback:</dt>
                        <dd>Allows players to submit feedback and shows recent submissions.</dd>
                    </div>
                     <div>
                        <dt className="font-semibold text-foreground">Staff:</dt>
                        <dd>Showcases the staff team. The staff admin can manage team members and access staff-only tools from here.</dd>
                    </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
