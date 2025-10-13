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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, Shield, Edit, Trash, PlusCircle, Upload } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

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

function RankForm({ rank, onSave, onOpenChange }: { rank?: WithId<Rank>; onSave: () => void; onOpenChange: (open: boolean) => void; }) {
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
      textColor: rank?.textColor || "#ffffff",
      gradientFrom: rank?.gradientFrom || "#868f96",
      gradientTo: rank?.gradientTo || "#596164",
      imageUrl: rank?.imageUrl || "",
      bestValue: rank?.bestValue || false,
    },
  });

  const onSubmit: SubmitHandler<RankFormValues> = async (data) => {
     if (!firestore) return;

      try {
        let uploadedImageUrl = rank?.imageUrl || '';
        // Check if a new file is being uploaded
        if (data.imageUrl && data.imageUrl[0] instanceof File) {
          const file: File = data.imageUrl[0];
          const path = `ranks/${Date.now()}_${file.name}`;
          uploadedImageUrl = await uploadFile(file, path);
        }

        const rankData = {
          name: data.name,
          price: data.price,
          perks: data.perks.split('\n').filter(p => p.trim() !== ""),
          coinBonus: data.coinBonus,
          textColor: data.textColor,
          gradientFrom: data.gradientFrom,
          gradientTo: data.gradientTo,
          imageUrl: uploadedImageUrl,
          bestValue: data.bestValue,
          adminKey: "hammadisjassi",
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
  
  const watchedTextColor = watch("textColor", rank?.textColor || "#ffffff");
  const watchedGradientFrom = watch("gradientFrom", rank?.gradientFrom || "#868f96");
  const watchedGradientTo = watch("gradientTo", rank?.gradientTo || "#596164");


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Rank Name" />
      {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}

      <Input {...register("price")} type="number" placeholder="Price" />
      {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}

      <Textarea {...register("perks")} placeholder="Perks (one per line, emojis supported ✨)" rows={4} />
      {errors.perks && <p className="text-destructive text-sm">{errors.perks.message}</p>}
      
      <Input {...register("coinBonus")} placeholder="Coin Bonus (e.g., + 1,000 coins)" />

       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex items-center gap-2">
            <Input id="textColor" type="color" {...register("textColor")} className="p-1 h-10"/>
            <Input value={watchedTextColor} onChange={e => setValue("textColor", e.target.value)} className="h-10"/>
          </div>
        </div>
        <div className="space-y-2">
           <Label>Image</Label>
           <Input id="imageUrl" type="file" {...register("imageUrl")} accept="image/png, image/jpeg" className="text-sm"/>
           {errors.imageUrl && <p className="text-destructive text-sm">{(errors.imageUrl as any).message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Gradient (optional)</Label>
        <div className="grid grid-cols-2 gap-4">
           <div className="flex items-center gap-2">
             <Input type="color" {...register("gradientFrom")} className="p-1 h-10"/>
             <Input value={watchedGradientFrom} onChange={e => setValue("gradientFrom", e.target.value)} placeholder="From" className="h-10"/>
           </div>
           <div className="flex items-center gap-2">
             <Input type="color" {...register("gradientTo")} className="p-1 h-10"/>
             <Input value={watchedGradientTo} onChange={e => setValue("gradientTo", e.target.value)} placeholder="To" className="h-10"/>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input {...register("bestValue")} type="checkbox" id="bestValue" className="h-4 w-4"/>
        <Label htmlFor="bestValue" className="text-sm font-medium">Mark as "Best Value"</Label>
      </div>
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Rank"}
        </Button>
      </DialogFooter>
    </form>
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

  const handleDelete = async (rankId: string) => {
    if (!firestore || !window.confirm("Are you sure you want to delete this rank?")) return;
    const rankDocRef = doc(firestore, "ranks", rankId);
    await deleteDocumentNonBlocking(rankDocRef);
    toast({ title: "Success", description: "Rank deleted successfully." });
  };

  const renderRankCard = (rank: WithId<Rank>) => {
    const titleStyle: React.CSSProperties =
      rank.gradientFrom && rank.gradientTo
        ? {
            color: 'transparent',
            background: `linear-gradient(to right, ${rank.gradientFrom}, ${rank.gradientTo})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }
        : { color: rank.textColor };

    return (
      <Card key={rank.id} className={cn("flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-primary/20 hover:shadow-2xl", rank.bestValue && "border-accent ring-2 ring-accent shadow-accent/20")}>
        {rank.bestValue && (
          <Badge className="absolute -top-3 right-3 bg-accent text-accent-foreground hover:bg-accent/90" >BEST VALUE</Badge>
        )}
        {isAuthenticated && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenForm(rank)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(rank.id)}>
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
        <CardHeader className="items-center text-center">
          {rank.imageUrl ? (
            <Image src={rank.imageUrl} alt={`${rank.name} icon`} width={48} height={48} className="mb-2"/>
          ) : (
            <Shield className="w-12 h-12 mb-2 text-slate-400" />
          )}
          <CardTitle className="text-2xl font-headline" style={titleStyle}>{rank.name}</CardTitle>
          <p className="text-3xl font-semibold text-foreground">₹{rank.price}</p>
          {rank.coinBonus && <p className="text-sm font-medium text-green-600">{rank.coinBonus}</p>}
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
    <section id="ranks" className="w-full py-12 md:py-20 relative">
      {!isAuthenticated && <AdminLogin onLogin={handleLogin} />}

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Server Ranks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto !text-base">
            Upgrade your rank to unlock powerful perks and show your support!
          </p>
        </div>

        {isAuthenticated && (
          <div className="text-center mb-8">
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Rank
            </Button>
          </div>
        )}
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRank ? 'Edit' : 'Add'} Rank</DialogTitle>
            </DialogHeader>
            <RankForm rank={editingRank} onSave={handleFormSave} onOpenChange={setIsFormOpen} />
          </DialogContent>
        </Dialog>

        {isLoading && <p className="text-center">Loading ranks...</p>}
        {ranks && ranks.length === 0 && !isLoading && <p className="text-center">No ranks available yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {ranks?.map(renderRankCard)}
        </div>
      </div>
    </section>
  );
}
