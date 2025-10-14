import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Feature Packages</h2>
          <CardDescription className="max-w-2xl mx-auto !text-lg">
            Coming soon! We are working on exciting new feature packages.
          </CardDescription>
        </div>
        <div className="flex justify-center">
            <Card className="w-full max-w-lg text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                        <Package className="w-12 h-12 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-2xl font-bold">Stay Tuned!</CardTitle>
                    <CardDescription className="mt-2 text-base">New feature packages will be available here soon. Keep an eye on our announcements!</CardDescription>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
