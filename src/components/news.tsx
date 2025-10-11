import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

const newsItems = [
  {
    title: 'Website Redesign',
    date: '11/10/2025',
    content: 'Our website has been completely redesigned with a modern interface, improved navigation, and enhanced user experience. New features include a streamlined purchase process through Discord tickets.',
  }
];

export function News() {
  return (
    <section id="news" className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Latest News</h2>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Stay up-to-date with the latest changes and events.
          </CardDescription>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          {newsItems.map((item) => (
            <Card key={item.title} className="w-full shadow-md transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
