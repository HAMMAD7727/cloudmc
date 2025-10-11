import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Feature Packages</h2>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Coming soon! We are working on exciting new feature packages.
          </CardDescription>
        </div>
        <div className="flex justify-center">
            <Card className="w-full max-w-lg text-center shadow-md">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Package className="w-12 h-12 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-2xl font-headline">Stay Tuned!</CardTitle>
                    <CardDescription className="mt-2">New feature packages will be available here soon. Keep an eye on our announcements!</CardDescription>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
