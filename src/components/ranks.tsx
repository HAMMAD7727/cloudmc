
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  collection,
  query,
  doc,
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
  useStorage,
} from "@/firebase";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, Shield, Edit, Trash, PlusCircle, Palette } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./ui/checkbox";
import { HoverEffectsGuide } from "./hover-effects-guide";
import { hoverEffects } from "@/lib/effects";

const rankSchema = z.object({
  name: z.string().min(1, "Rank name is required."),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive("Price must be a positive number.")),
  perks: z.string().min(1, "Please add at least one perk."),
  coinBonus: z.string().optional(),
  textColor: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  imageUrl: z.any().optional(),
  bestValue: z.boolean().default(false),
  hoverEffect: z.string().optional(),
});

type RankFormValues = z.infer<typeof rankSchema>;

type Rank = {
  name: string;
  price: number;
  perks: string[];
  coinBonus?: string;
  textColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string;
  bestValue?: boolean;
  adminKey?: string;
  hoverEffect?: string;
};

const PRESET_COLORS = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Dark Red', value: '#AA0000' },
    { name: 'Red', value: '#FF5555' },
    { name: 'Gold', value: '#FFAA00' },
    { name: 'Yellow', value: '#FFFF55' },
    { name: 'Dark Green', value: '#00AA00' },
    { name: 'Green', value: '#55FF55' },
    { name: 'Aqua', value: '#55FFFF' },
    { name: 'Dark Aqua', value: '#00AAAA' },
    { name: 'Dark Blue', value: '#0000AA' },
    { name: 'Blue', value: '#5555FF' },
    { name: 'Light Purple', value: '#FF55FF' },
    { name: 'Dark Purple', value: '#AA00AA' },
    { name: 'Gray', value: '#AAAAAA' },
    { name: 'Dark Gray', value: '#555555' },
];

function ColorSelect({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  const selectValue = value && value !== "" ? value : "none";
  return (
    <Select onValueChange={onChange} value={selectValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a color" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        {PRESET_COLORS.map(color => (
          <SelectItem key={color.name} value={color.value}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.value }}/>
              {color.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async () => {
    if (password === "hammadisjassi") {
      try {
        await initiateAnonymousSignIn(auth);
        sessionStorage.setItem("isRankAdminAuthenticated", "true");
        onLogin();
        toast({ title: "Success", description: "Logged in as rank admin." });
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
        <DialogHeader>
          <DialogTitle>Rank Admin Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleLogin}>Login</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RankForm({ rank, onSave }: { rank?: WithId<Rank>; onSave: () => void; }) {
  const firestore = useFirestore();
  const { uploadFile } = useStorage();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      name: rank?.name || "",
      price: rank?.price || 0,
      perks: rank?.perks.join("\n") || "",
      coinBonus: rank?.coinBonus || "",
      textColor: rank?.textColor || "#FFFFFF",
      gradientFrom: rank?.gradientFrom || "none",
      gradientTo: rank?.gradientTo || "none",
      imageUrl: rank?.imageUrl || "",
      bestValue: rank?.bestValue || false,
      hoverEffect: rank?.hoverEffect || "None",
    },
  });

  const onSubmit: SubmitHandler<RankFormValues> = async (data) => {
     if (!firestore) return;

      try {
        let uploadedImageUrl = rank?.imageUrl || '';
        if (data.imageUrl && data.imageUrl[0] instanceof File) {
          const file: File = data.imageUrl[0];
          const path = `ranks/${Date.now()}_${file.name}`;
          uploadedImageUrl = await uploadFile(file, path);
        }

        const rankData = {
          ...data,
          perks: data.perks.split('\n').filter(p => p.trim() !== ""),
          imageUrl: uploadedImageUrl,
          adminKey: "hammadisjassi",
          textColor: data.textColor === 'none' ? '' : data.textColor,
          gradientFrom: data.gradientFrom === 'none' ? '' : data.gradientFrom,
          gradientTo: data.gradientTo === 'none' ? '' : data.gradientTo,
          hoverEffect: data.hoverEffect === 'None' ? '' : data.hoverEffect,
        };

        if (rank) {
          const rankDocRef = doc(firestore, "ranks", rank.id);
          await setDocumentNonBlocking(rankDocRef, rankData, { merge: true });
          toast({ title: "Rank Updated!", description: `${data.name} has been updated.` });
        } else {
          const ranksCollection = collection(firestore, "ranks");
          await addDocumentNonBlocking(ranksCollection, rankData);
          toast({ title: "Rank Added!", description: `${data.name} has been added.` });
        }
        reset();
        onSave();
      } catch (error) {
         toast({ variant: "destructive", title: "Error", description: "An error occurred." });
      }
  };
  
  const handleColorChange = (field: 'textColor' | 'gradientFrom' | 'gradientTo', value: string) => {
    setValue(field, value);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Rank Name</Label>
                <Input id="name" {...register("name")} placeholder="e.g., Warrior" />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" {...register("price")} type="number" placeholder="e.g., 500" />
                {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="perks">Perks (one per line)</Label>
            <Textarea id="perks" {...register("perks")} placeholder="✨ One awesome perk per line..." rows={5} />
            {errors.perks && <p className="text-destructive text-sm">{errors.perks.message}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="coinBonus">Coin Bonus (optional)</Label>
                <Input id="coinBonus" {...register("coinBonus")} placeholder="e.g., +1,000 Coins" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hoverEffect">Hover Effect</Label>
                <Select onValueChange={(value) => setValue('hoverEffect', value)} value={watch('hoverEffect') || 'None'}>
                    <SelectTrigger id="hoverEffect">
                        <SelectValue placeholder="Select a hover effect" />
                    </SelectTrigger>
                    <SelectContent>
                        {hoverEffects.map(effect => (
                            <SelectItem key={effect.name} value={effect.name === 'None' ? 'None' : effect.className}>{effect.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Image (optional)</Label>
            <Input id="imageUrl" type="file" {...register("imageUrl")} accept="image/png, image/jpeg" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
            {errors.imageUrl && <p className="text-destructive text-sm">{(errors.imageUrl as any).message}</p>}
        </div>

        <Card className="p-4 bg-muted/30">
            <CardHeader className="p-2">
                <CardTitle className="text-lg flex items-center gap-2"><Palette /> Display Colors</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-4">
                <div className="space-y-2">
                    <Label>Text Color</Label>
                    <ColorSelect value={watch('textColor')} onChange={(color) => handleColorChange('textColor', color)} />
                </div>
                <div className="space-y-2">
                    <Label>Gradient (optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gradientFrom" className="text-sm font-normal text-muted-foreground">From</Label>
                            <ColorSelect value={watch('gradientFrom')} onChange={(color) => handleColorChange('gradientFrom', color)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gradientTo" className="text-sm font-normal text-muted-foreground">To</Label>
                            <ColorSelect value={watch('gradientTo')} onChange={(color) => handleColorChange('gradientTo', color)} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="flex items-center space-x-2">
            <Checkbox id="bestValue" checked={watch('bestValue')} onCheckedChange={(checked) => setValue('bestValue', !!checked)} />
            <Label htmlFor="bestValue" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mark as "Best Value"
            </Label>
        </div>

        <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4">
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Rank"}
            </Button>
        </DialogFooter>
        </form>
    </div>
  );
}

export function Ranks() {
  const firestore = useFirestore();
  const ranksQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "ranks")) : null, [firestore]);
  const { data: ranks, isLoading } = useCollection<Rank>(ranksQuery);
  const { toast } = useToast();
  const { user } = useUser();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<WithId<Rank> | undefined>(undefined);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("isRankAdminAuthenticated");
    if (sessionAuth === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingRank(undefined);
  };
  
  const handleOpenForm = (rank?: WithId<Rank>) => {
    setEditingRank(rank);
    setIsFormOpen(true);
  };

  const handleDelete = async (rankId: string, rankName: string) => {
    if (!firestore || !window.confirm(`Are you sure you want to delete the "${rankName}" rank?`)) {
      return;
    }

    try {
      await deleteDocumentNonBlocking(doc(firestore, 'ranks', rankId));
      toast({ title: "Success", description: `Rank "${rankName}" deleted successfully.` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not delete rank.",
      });
    }
  };

  const renderRankCard = (rank: WithId<Rank>, index: number) => {
    const titleStyle: React.CSSProperties =
      rank.gradientFrom && rank.gradientTo
        ? {
            backgroundImage: `linear-gradient(to right, ${rank.gradientFrom}, ${rank.gradientTo})`,
          }
        : { color: rank.textColor || '#FFFFFF' };

    return (
      <Card key={rank.id} className={cn("flex flex-col transition-all duration-300 animate-slide-in", rank.hoverEffect, rank.bestValue && "border-accent ring-2 ring-accent shadow-accent/20")} style={{animationDelay: `${index * 100}ms`}}>
        {rank.bestValue && (
          <Badge className="absolute -top-3 right-3 bg-accent text-accent-foreground hover:bg-accent/90 border-2 border-background" >BEST VALUE</Badge>
        )}
        {isAuthenticated && (
          <div className="absolute top-2 right-2 flex gap-1 bg-background/50 backdrop-blur-sm rounded-md p-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenForm(rank)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(rank.id, rank.name)}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
        <CardHeader className="items-center text-center pt-8">
          {rank.imageUrl ? (
            <Image src={rank.imageUrl} alt={`${rank.name} icon`} width={48} height={48} className="mb-2"/>
          ) : (
            <Shield className="w-12 h-12 mb-2 text-muted-foreground" />
          )}
          <CardTitle className={cn("text-3xl font-black", rank.gradientFrom && rank.gradientTo && "text-gradient")} style={titleStyle}>{rank.name}</CardTitle>
          <p className="text-4xl font-bold text-foreground">₹{rank.price}</p>
          {rank.coinBonus && <p className="text-sm font-medium text-green-500">{rank.coinBonus}</p>}
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {rank.perks.map((perk, index) => (
              <li key={index} className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-muted-foreground">{perk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <BuyNowButton />
        </CardFooter>
      </Card>
    );
  };

  return (
    <section id="ranks" className="w-full py-16 md:py-24 relative">
      {!isAuthenticated && <AdminLogin onLogin={handleLogin} />}

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Server Ranks</h2>
          <CardDescription className="max-w-2xl mx-auto !text-lg">
            Upgrade your rank to unlock powerful perks and show your support!
          </CardDescription>
        </div>

        {isAuthenticated && (
          <div className="text-center mb-8 flex items-center justify-center gap-4">
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Rank
            </Button>
            <HoverEffectsGuide />
          </div>
        )}
        
        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setEditingRank(undefined); } setIsFormOpen(open); }}>
          <DialogContent className="max-w-2xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{editingRank ? 'Edit' : 'Add'} Rank</DialogTitle>
              <CardDescription>Fill out the details for the rank below.</CardDescription>
            </DialogHeader>
            <RankForm rank={editingRank} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>

        {isLoading && <p className="text-center">Loading ranks...</p>}
        {ranks && ranks.length === 0 && !isLoading && <p className="text-center text-muted-foreground">No ranks available yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {ranks?.map(renderRankCard)}
        </div>
      </div>
    </section>
  );
}
