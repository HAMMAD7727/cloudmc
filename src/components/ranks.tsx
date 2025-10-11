"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  collection,
  query,
  doc,
  deleteDoc,
  setDoc,
  addDoc
} from "firebase/firestore";
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  initiateAnonymousSignIn,
  useAuth,
  useUser,
  type WithId,
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
import { Check, Shield, Gem, Star, Crown, Sparkles, Edit, Trash, PlusCircle } from "lucide-react";
import { BuyNowButton } from "./buy-now-button";
import { cn } from "@/lib/utils";

const rankSchema = z.object({
  name: z.string().min(3, "Rank name is required."),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive("Price must be a positive number.")),
  perks: z.string().min(1, "Please add at least one perk."),
  coinBonus: z.string().optional(),
  icon: z.enum(["Shield", "Gem", "Star", "Crown", "Sparkles"]).default("Shield"),
  color: z.string().default("text-slate-500"),
  bestValue: z.boolean().default(false),
});

type RankFormValues = z.infer<typeof rankSchema>;

type Rank = {
  name: string;
  price: number;
  perks: string[];
  coinBonus?: string;
  icon: "Shield" | "Gem" | "Star" | "Crown" | "Sparkles";
  color: string;
  bestValue?: boolean;
};

const icons = {
  Shield,
  Gem,
  Star,
  Crown,
  Sparkles,
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = () => {
    if (password === "hammadisjassi") {
      initiateAnonymousSignIn(auth);
      sessionStorage.setItem("isRankAdminAuthenticated", "true");
      onLogin();
      toast({ title: "Success", description: "Logged in as rank admin." });
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
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      name: rank?.name || "",
      price: rank?.price || 0,
      perks: rank?.perks.join("\n") || "",
      coinBonus: rank?.coinBonus || "",
      icon: rank?.icon || "Shield",
      color: rank?.color || "text-slate-500",
      bestValue: rank?.bestValue || false,
    },
  });

  const onSubmit: SubmitHandler<RankFormValues> = async (data) => {
     if (!firestore) return;
    try {
      const rankData = {
        ...data,
        perks: data.perks.split('\n').filter(p => p.trim() !== ""),
        adminKey: "hammadisjassi",
      };

      if (rank) {
        const rankDocRef = doc(firestore, "ranks", rank.id);
        await setDoc(rankDocRef, rankData, { merge: true });
        toast({ title: "Rank Updated!", description: `${data.name} has been updated.` });
      } else {
        const ranksCollection = collection(firestore, "ranks");
        await addDoc(ranksCollection, rankData);
        toast({ title: "Rank Added!", description: `${data.name} has been added.` });
      }
      reset();
      onSave();
    } catch (error: any) {
       toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: error.message || "Could not save the rank." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Rank Name" />
      {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}

      <Input {...register("price")} type="number" placeholder="Price" />
      {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}

      <Textarea {...register("perks")} placeholder="Perks (one per line)" rows={5} />
      {errors.perks && <p className="text-destructive text-sm">{errors.perks.message}</p>}
      
      <Input {...register("coinBonus")} placeholder="Coin Bonus (e.g., + 1,000 coins)" />
      
      <div>
        <label className="text-sm font-medium">Icon</label>
        <select {...register("icon")} className="w-full p-2 border rounded-md">
          {Object.keys(icons).map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
        </select>
      </div>

      <Input {...register("color")} placeholder="Icon Color (e.g., text-red-500)" />

      <div className="flex items-center gap-2">
        <input {...register("bestValue")} type="checkbox" id="bestValue" className="h-4 w-4"/>
        <label htmlFor="bestValue">Best Value?</label>
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
    try {
      await deleteDoc(doc(firestore, "ranks", rankId));
      toast({ title: "Success", description: "Rank deleted successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Could not delete rank." });
    }
  };

  const renderRankCard = (rank: WithId<Rank>) => {
    const RankIcon = icons[rank.icon as keyof typeof icons] || Shield;
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
          <RankIcon className={cn("w-12 h-12 mb-2", rank.color)} />
          <CardTitle className="text-2xl font-headline">{rank.name}</CardTitle>
          <p className="text-3xl font-semibold text-foreground">₹{rank.price}</p>
          {rank.coinBonus && <p className="text-sm font-medium text-green-600">{rank.coinBonus}</p>}
        </CardHeader>
        <CardContent className="flex-grow">
          <ul className="space-y-3">
            {rank.perks.map((perk) => (
              <li key={perk} className="flex items-start">
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
          <DialogContent>
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
