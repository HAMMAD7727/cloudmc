
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  collection,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  initiateAnonymousSignIn,
  useAuth,
  useUser,
  type WithId,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from "@/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, Trash, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";
import { HoverEffectsGuide } from "./hover-effects-guide";

// List of some lucide-react icons. You can expand this.
const ICON_LIST = [
  "Package", "Award", "BadgeCheck", "Bolt", "Box", "BrainCircuit", "Castle", "Cat",
  "Cherry", "CircuitBoard", "Cloud", "Code", "Cog", "Coins", "Compass", "Cpu", "Crown",
  "Database", "Diamond", "Dog", "DownloadCloud", "Dumbbell", "Feather", "FileCode",
  "Flame", "FlaskConical", "Gamepad2", "Gem", "Ghost", "Gift", "GitFork", "Github",
  "GraduationCap", "Heart", "HelpCircle", "Key", "Keyboard", "Laptop", "Layers", "Leaf",
  "LifeBuoy", "Lightbulb", "Lock", "Mail", "Map", "Medal", "Megaphone", "Menu", "MessageSquare",
  "Mic", "Monitor", "Mouse", "Music", "Palette", "PenTool", "Pencil", "PieChart", "Pizza",
  "Plane", "Plug", "Plus", "Pocket", "Podcast", "Power", "Printer", "Puzzle", "Quote",
  "Radio", "Recycle", "Rocket", "Save", "School", "Scissors", "ScreenShare", "Send",
  "Server", "Settings", "Share2", "Sheet", "Shield", "Ship", "Signal", "Smartphone",
  "Smile", "Sparkles", "Speaker", "Star", "Store", "Sun", "Sword", "Swords", "Trophy",
  "Truck", "Tv", "Umbrella", "User", "Users", "Video", "Wallet", "Watch", "Wifi", "Wind",
  "Wrench", "Youtube", "Zap"
] as const;

type IconName = (typeof ICON_LIST)[number];

const featureSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  icon: z.enum(ICON_LIST),
  color: z.string().optional(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

type FeatureItem = {
  title: string;
  description: string;
  icon: IconName;
  color?: string;
  adminKey?: string;
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async () => {
    if (password === "hammadisjassi") {
      try {
        await initiateAnonymousSignIn(auth);
        sessionStorage.setItem("isFeatureAdminAuthenticated", "true");
        onLogin();
        toast({ title: "Success", description: "Logged in as feature admin." });
      } catch (error) {
         toast({ variant: "destructive", title: "Error", description: "Login failed." });
      }
    } else {
      toast({ variant: "destructive", title: "Error", description: "Incorrect password." });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute top-4 right-4">Admin Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>Feature Admin Login</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyUp={(e) => e.key === 'Enter' && handleLogin()}/>
        </div>
        <DialogFooter><DialogClose asChild><Button onClick={handleLogin}>Login</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeatureForm({ featureItem, onSave }: { featureItem?: WithId<FeatureItem>; onSave: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: featureItem?.title || "",
      description: featureItem?.description || "",
      icon: featureItem?.icon || "Package",
      color: featureItem?.color || "#8B5CF6",
    },
  });

  const onSubmit: SubmitHandler<FeatureFormValues> = async (data) => {
    if (!firestore) return;
    try {
      const featureData = {
        ...data,
        adminKey: "hammadisjassi",
      };

      if (featureItem) {
        await setDocumentNonBlocking(doc(firestore, "features", featureItem.id), featureData, { merge: true });
        toast({ title: "Feature Updated!", description: `"${data.title}" has been updated.` });
      } else {
        await addDocumentNonBlocking(collection(firestore, "features"), featureData);
        toast({ title: "Feature Added!", description: `"${data.title}" has been published.` });
      }
      reset();
      onSave();
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };

  const IconPreview = Icons[watch("icon") as IconName] || Icons.Package;
  
  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Enter the feature title" />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} placeholder="Write the feature description here..." rows={4} />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select onValueChange={(value: IconName) => setValue('icon', value, {shouldValidate: true})} value={watch('icon')}>
                        <SelectTrigger id="icon">
                           <div className="flex items-center gap-2">
                            <IconPreview className="w-5 h-5" />
                            <SelectValue placeholder="Select an icon" />
                           </div>
                        </SelectTrigger>
                        <SelectContent>
                            {ICON_LIST.map(iconName => {
                                const Icon = Icons[iconName];
                                return (
                                <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center gap-2">
                                        {Icon && <Icon className="w-5 h-5" />}
                                        <span>{iconName}</span>
                                    </div>
                                </SelectItem>
                            )})}
                        </SelectContent>
                    </Select>
                     {errors.icon && <p className="text-destructive text-sm">{errors.icon.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="color">Highlight Color</Label>
                    <Input id="color" {...register("color")} type="color" className="p-1 h-10"/>
                </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4">
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Feature"}
                </Button>
            </DialogFooter>
        </form>
    </div>
  );
}


export function Features() {
  const firestore = useFirestore();
  const featuresQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "features"), orderBy("title")) : null, [firestore]);
  const { data: featureItems, isLoading } = useCollection<FeatureItem>(featuresQuery);
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<WithId<FeatureItem> | undefined>(undefined);

  useEffect(() => {
    if (sessionStorage.getItem("isFeatureAdminAuthenticated") === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => setIsAuthenticated(true);
  
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingFeature(undefined);
  };
  
  const handleOpenForm = (item?: WithId<FeatureItem>) => {
    setEditingFeature(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: WithId<FeatureItem>) => {
    if (!firestore || !window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
        await deleteDocumentNonBlocking(doc(firestore, "features", item.id));
        toast({ title: "Success", description: "Feature deleted." });
    } catch(e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete feature." });
    }
  };


  return (
    <section id="features" className="w-full py-16 md:py-24 relative">
      {!isAuthenticated && <AdminLogin onLogin={handleLogin} />}

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Feature Packages</h2>
          <CardDescription className="max-w-2xl mx-auto !text-lg">
            Explore the unique features and perks available in our store.
          </CardDescription>
        </div>
        
        {isAuthenticated && (
          <div className="text-center mb-8 flex items-center justify-center gap-4">
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Feature
            </Button>
            <HoverEffectsGuide />
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setEditingFeature(undefined); } setIsFormOpen(open); }}>
          <DialogContent className="max-w-2xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{editingFeature ? 'Edit' : 'Add'} Feature</DialogTitle>
            </DialogHeader>
            <FeatureForm featureItem={editingFeature} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && [...Array(3)].map((_, i) => (
             <Card key={i} className="w-full">
                <CardHeader>
                    <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                       <div className="w-12 h-12 bg-muted-foreground/20 rounded-full"/>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="h-7 w-1/2 mx-auto bg-muted-foreground/20 rounded-md"/>
                    <div className="h-4 w-3/4 mx-auto bg-muted-foreground/10 rounded-md mt-4"/>
                    <div className="h-4 w-2/3 mx-auto bg-muted-foreground/10 rounded-md mt-2"/>
                </CardContent>
             </Card>
          ))}
          {!isLoading && featureItems?.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full">No features have been added yet.</p>
          )}
          {featureItems?.map((item, index) => {
            const Icon = Icons[item.icon as IconName] || Icons.Package;
            return (
            <Card key={item.id} className="w-full text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 relative animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                 {isAuthenticated && (
                <div className="absolute top-2 right-2 flex gap-1 bg-background/50 backdrop-blur-sm rounded-md p-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenForm(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDelete(item)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
                <CardHeader>
                    <div className="mx-auto rounded-full p-4 w-fit transition-colors" style={{ backgroundColor: item.color ? `${item.color}33` : 'hsl(var(--primary) / 0.1)' }}>
                        <Icon className="w-12 h-12" style={{color: item.color || 'hsl(var(--primary))'}} />
                    </div>
                </CardHeader>
                <CardContent>
                    <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">{item.description}</CardDescription>
                </CardContent>
            </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
