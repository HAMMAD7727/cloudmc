
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  useStorage
} from "@/firebase";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronsUpDown, Code, Gamepad2, Settings, Edit, Trash, PlusCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

const mySkills = [
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

const staffMemberSchema = z.object({
  name: z.string().min(2, "Name is required."),
  imageUrl: z.any(),
  rank: z.string().min(2, "Rank is required."),
  roleDescription: z.string().min(10, "Description is required."),
  email: z.string().email("A valid email is required to link to chat.").optional().or(z.literal('')),
});

type StaffFormValues = z.infer<typeof staffMemberSchema>;

type StaffMember = {
  name: string;
  imageUrl: string;
  rank: string;
  roleDescription: string;
  email?: string;
  adminKey?: string;
};

function StaffAdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = () => {
    if (password === "cloudmcstaff") {
      initiateAnonymousSignIn(auth);
      sessionStorage.setItem("isStaffAdminAuthenticated", "true");
      onLogin();
      toast({ title: "Success", description: "Logged in as staff admin." });
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
        <DialogHeader><DialogTitle>Staff Admin Login</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyUp={(e) => e.key === 'Enter' && handleLogin()} />
        </div>
        <DialogFooter><DialogClose asChild><Button onClick={handleLogin}>Login</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StaffForm({ staffMember, onSave }: { staffMember?: WithId<StaffMember>; onSave: () => void; }) {
  const firestore = useFirestore();
  const { uploadFile } = useStorage();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      name: staffMember?.name || "",
      imageUrl: staffMember?.imageUrl || "",
      rank: staffMember?.rank || "",
      roleDescription: staffMember?.roleDescription || "",
      email: staffMember?.email || "",
    },
  });

  const onSubmit: SubmitHandler<StaffFormValues> = async (data) => {
    if (!firestore) return;
    try {
      let imageUrl = staffMember?.imageUrl || '';
      if (data.imageUrl && data.imageUrl[0] instanceof File) {
        const file: File = data.imageUrl[0];
        const path = `staff/${Date.now()}_${file.name}`;
        imageUrl = await uploadFile(file, path);
      }

      const staffData = { 
        name: data.name,
        rank: data.rank,
        roleDescription: data.roleDescription,
        imageUrl: imageUrl,
        email: data.email,
        adminKey: "cloudmcstaff"
      };

      if (staffMember) {
        await setDocumentNonBlocking(doc(firestore, "staff", staffMember.id), staffData, { merge: true });
        toast({ title: "Staff Member Updated!", description: `${data.name} has been updated.` });
      } else {
        await addDocumentNonBlocking(collection(firestore, "staff"), staffData);
        toast({ title: "Staff Member Added!", description: `${data.name} has been added.` });
      }
      reset();
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Uh oh!", description: error.message || "Could not save staff member." });
    }
  };

  return (
     <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Staff Name</Label>
                <Input id="name" {...register("name")} placeholder="e.g., Jane Doe" />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input id="rank" {...register("rank")} placeholder="e.g., Admin, Founder" />
                {errors.rank && <p className="text-destructive text-sm">{errors.rank.message}</p>}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="imageUrl">Profile Image</Label>
                <Input id="imageUrl" {...register("imageUrl")} type="file" accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                {errors.imageUrl && <p className="text-destructive text-sm">{(errors.imageUrl as any).message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">User Email (for chat badge)</Label>
                <Input id="email" {...register("email")} placeholder="e.g., user@example.com" />
                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="roleDescription">Role Description</Label>
                <Textarea id="roleDescription" {...register("roleDescription")} placeholder="Briefly describe their role..." rows={4} />
                {errors.roleDescription && <p className="text-destructive text-sm">{errors.roleDescription.message}</p>}
            </div>
            
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Staff Member"}</Button>
            </DialogFooter>
        </form>
    </div>
  );
}


export function Staff() {
  const firestore = useFirestore();
  const staffQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "staff")) : null, [firestore]);
  const { data: staff, isLoading } = useCollection<StaffMember>(staffQuery);
  const { toast } = useToast();
  const { user } = useUser();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<WithId<StaffMember> | undefined>(undefined);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("isStaffAdminAuthenticated");
    if (sessionAuth === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingStaff(undefined);
  };
  const handleOpenForm = (staffMember?: WithId<StaffMember>) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (!firestore || !window.confirm("Are you sure? This action cannot be undone.")) return;
    const staffDocRef = doc(firestore, "staff", staffId);
    try {
        await deleteDocumentNonBlocking(staffDocRef);
        toast({ title: "Success", description: "Staff member removed." });
    } catch(e) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not delete staff member. Check security rules.",
        });
    }
  };
  
  const rankStyles: { [key: string]: string } = {
    'developer': 'bg-accent/80 text-accent-foreground',
    'founder': 'bg-yellow-500/80 text-yellow-950 border border-yellow-600/50',
    'admin': 'bg-red-500/80 text-red-950',
    'default': 'bg-secondary text-secondary-foreground'
  };
  
  const getRankStyle = (rank: string) => {
    const rankLower = rank.toLowerCase();
    return rankStyles[rankLower] || rankStyles['default'];
  }


  return (
    <section id="staff" className="w-full py-12 md:py-20 bg-primary/5 relative">
      {!isAuthenticated && <StaffAdminLogin onLogin={handleLogin} />}
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Our Staff</h2>
           <CardDescription className="max-w-2xl mx-auto !text-base">
            Meet the dedicated team that keeps Cloudverse running.
          </CardDescription>
        </div>
        
        {isAuthenticated && (
          <div className="text-center mb-8">
            <Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add New Staff</Button>
          </div>
        )}
        
        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setEditingStaff(undefined); } setIsFormOpen(open); }}>
          <DialogContent className="max-w-lg p-0">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle>{editingStaff ? 'Edit' : 'Add'} Staff Member</DialogTitle>
                <CardDescription>Manage the details for your team members.</CardDescription>
            </DialogHeader>
            <StaffForm staffMember={editingStaff} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>

        <div className="space-y-12">
          {/* Hammad's Static Profile */}
          <Card className="w-full max-w-2xl mx-auto transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-primary/20 hover:shadow-2xl border-2 border-accent">
            <CardHeader className="text-center items-center p-8">
              <Image src="https://hammadprofile.netlify.app/imagie/hammad.webp" alt="Hammad's Profile Picture" width={100} height={100} className="rounded-full mb-4 border-4 border-accent/30 shadow-lg"/>
              <CardTitle className="text-3xl font-headline">Hammad</CardTitle>
              <Badge className={cn("text-sm font-bold uppercase tracking-wider", getRankStyle('developer'))}>
                Developer
              </Badge>
            </CardHeader>
            <CardContent className="px-6">
              <Collapsible className="w-full">
                <div className="flex items-center justify-center"><CollapsibleTrigger asChild><Button variant="outline" className="mb-4">View Skills <ChevronsUpDown className="w-4 h-4 ml-2" /></Button></CollapsibleTrigger></div>
                <CollapsibleContent>
                  <div className="space-y-6 rounded-lg border p-6 bg-background">
                    {mySkills.map((skill) => {
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
            <CardFooter className="flex justify-center pb-8"><Button asChild><Link href="https://hammadprofile.vercel.app" target="_blank">Check his portfolio</Link></Button></CardFooter>
          </Card>

          {/* Dynamic Staff Members */}
          {isLoading ? (
            <p className="text-center">Loading staff...</p>
          ) : staff && staff.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {staff.map((member) => (
                <Card key={member.id} className="flex flex-col text-center items-center transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-primary/20 hover:shadow-2xl relative group">
                   {isAuthenticated && (
                    <div className="absolute top-2 right-2 flex gap-1 bg-background/50 backdrop-blur-sm rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenForm(member)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDelete(member.id)}><Trash className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  )}
                  <CardHeader className="pt-8 w-full">
                    {member.imageUrl && (
                      <Image src={member.imageUrl} alt={`${member.name}'s profile picture`} width={80} height={80} className="rounded-full border-4 border-primary/10 shadow-md mx-auto"/>
                    )}
                    <CardTitle className="text-2xl font-headline mt-4">{member.name}</CardTitle>
                    <Badge className={cn("text-xs font-bold uppercase tracking-wider mx-auto", getRankStyle(member.rank))}>
                      {member.rank === 'founder' && <Crown className="w-3 h-3 mr-1.5"/>}
                      {member.rank}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{member.roleDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground col-span-full">No other staff members have been added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
