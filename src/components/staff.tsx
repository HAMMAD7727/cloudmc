import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Code, Gamepad2, Settings } from "lucide-react";

const skills = [
  {
    category: "Web Development",
    icon: Code,
    list: "HTML, CSS, JavaScript, Node.js, Firebase Realtime Database",
  },
  {
    category: "Programming",
    icon: Code,
    list: "Java (basic), Python (basic), C++ (basic)",
  },
  {
    category: "Minecraft",
    icon: Gamepad2,
    list: "Plugin development, Mod development, Texture pack creation, Server management",
  },
  {
    category: "Other",
    icon: Settings,
    list: "Discord server management, Website hosting & deployment",
  },
];

export function Staff() {
  return (
    <section id="staff" className="w-full py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        <Card className="w-full max-w-2xl transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-primary/20 hover:shadow-2xl">
          <CardHeader className="text-center items-center">
             <Image
              src="https://hammadprofile.netlify.app/imagie/hammad.webp"
              alt="Hammad's Profile Picture"
              width={96}
              height={96}
              className="rounded-full mb-4 border-4 border-primary/20 shadow-lg"
            />
            <CardTitle className="text-3xl font-headline">Hammad</CardTitle>
            <Badge variant="secondary" className="text-sm font-bold uppercase tracking-wider bg-accent/80 text-accent-foreground">
                Developer of this Website
            </Badge>
          </CardHeader>
          <CardContent>
            <Collapsible className="w-full">
              <div className="flex items-center justify-center">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="mb-4">
                    View Skills
                    <ChevronsUpDown className="w-4 h-4 ml-2" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="space-y-6 rounded-lg border p-6">
                  {skills.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div key={skill.category}>
                        <div className="flex items-center gap-3 mb-2">
                           <Icon className="w-5 h-5 text-primary" />
                           <h3 className="text-lg font-semibold">{skill.category}</h3>
                        </div>
                        <p className="text-muted-foreground ml-8">{skill.list}</p>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="https://hammadprofile.vercel.app" target="_blank">
                Check his portfolio
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
