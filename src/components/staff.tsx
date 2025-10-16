
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
import { ChevronsUpDown, Code, Gamepad2, Settings, Edit, Trash, PlusCircle, Crown, LogOut, Users, BookOpen, MessageSquare, Gift, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { HoverEffectsGuide } from "./hover-effects-guide";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { hoverEffects } from "@/lib/effects";
import { useTabStore } from "@/lib/tab-store";
import { StaffGuide } from "./staff-guide";
import { StaffChat } from "./staff-chat";
import { StaffPresents } from "./staff-presents";

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
  imageUrl: z.any().optional(),
  imageUrlString: z.string().optional(),
  imageUploadMethod: z.enum(['upload', 'url']),
  rank: z.string().min(2, "Rank is required."),
  roleDescription: z.string().min(10, "Description is required."),
  email: z.string().email("A valid email is required to link to chat.").optional().or(z.literal('')),
  hoverEffect: z.string().optional(),
}).refine(data => {
    if (data.imageUploadMethod === 'url') {
        return !!data.imageUrlString && z.string().url().safeParse(data.imageUrlString).success;
    }
    return true;
}, {
    message: "A valid URL is required if using the URL method.",
    path: ["imageUrlString"],
});


type StaffFormValues = z.infer<typeof staffMemberSchema>;

type StaffMember = {
  name: string;
  imageUrl: string;
  rank: string;
  roleDescription: string;
  email?: string;
  adminKey?: string;
  hoverEffect?: string;
};

type StaffView = 'dashboard' | 'manage' | 'guide' | 'chat' | 'presents';


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
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      name: staffMember?.name || "",
      imageUrl: "",
      imageUrlString: staffMember?.imageUrl || "",
      imageUploadMethod: staffMember?.imageUrl ? 'url' : 'upload',
      rank: staffMember?.rank || "",
      roleDescription: staffMember?.roleDescription || "",
      email: staffMember?.email || "",
      hoverEffect: staffMember?.hoverEffect || "",
    },
  });

  const imageUploadMethod = watch("imageUploadMethod");

  useEffect(() => {
    if (staffMember) {
        setValue("imageUrlString", staffMember.imageUrl || "");
        setValue("imageUploadMethod", "url");
    }
  }, [staffMember, setValue]);

  const onSubmit: SubmitHandler<StaffFormValues> = async (data) => {
    if (!firestore) return;
    try {
      let finalImageUrl = staffMember?.imageUrl || '';
      
      if (data.imageUploadMethod === 'upload' && data.imageUrl && data.imageUrl[0] instanceof File) {
        const file: File = data.imageUrl[0];
        finalImageUrl = await uploadFile(file, `staff/${Date.now()}_${file.name}`);
      } else if (data.imageUploadMethod === 'url' && data.imageUrlString) {
        finalImageUrl = data.imageUrlString;
      }

      const staffData = { 
        name: data.name,
        rank: data.rank,
        roleDescription: data.roleDescription,
        imageUrl: finalImageUrl,
        email: data.email,
        hoverEffect: data.hoverEffect,
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
                <Label>Profile Image</Label>
                 <RadioGroup 
                    defaultValue={imageUploadMethod}
                    onValueChange={(value: 'upload' | 'url') => setValue('imageUploadMethod', value)}
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                        <RadioGroupItem value="upload" id="upload" className="peer sr-only" />
                        <Label htmlFor="upload" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Upload File
                        </Label>
                    </div>

                     <div>
                        <RadioGroupItem value="url" id="url" className="peer sr-only" />
                        <Label htmlFor="url" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Image URL
                        </Label>
                    </div>
                </RadioGroup>

                {imageUploadMethod === 'upload' ? (
                    <Input id="imageUrl" {...register("imageUrl")} type="file" accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                ) : (
                    <Input id="imageUrlString" {...register("imageUrlString")} type="text" placeholder="https://example.com/image.png" />
                )}
                 {errors.imageUrl && <p className="text-destructive text-sm">{(errors.imageUrl as any).message}</p>}
                 {errors.imageUrlString && <p className="text-destructive text-sm">{errors.imageUrlString.message}</p>}
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

            <div className="space-y-2">
                <Label htmlFor="hoverEffect">Hover Effect</Label>
                <Select onValueChange={(value) => setValue('hoverEffect', value)} value={watch('hoverEffect')}>
                    <SelectTrigger id="hoverEffect">
                        <SelectValue placeholder="Select a hover effect" />
                    </SelectTrigger>
                    <SelectContent>
                        {hoverEffects.map(effect => (
                            <SelectItem key={effect.name} value={effect.className}>{effect.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4">
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Staff Member"}</Button>
            </DialogFooter>
        </form>
    </div>
  );
}

function TeamManagement() {
  const firestore = useFirestore();
  const staffQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "staff")) : null, [firestore]);
  const { data: staff, isLoading } = useCollection<StaffMember>(staffQuery);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<WithId<StaffMember> | undefined>(undefined);

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
    'developer': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    'founder': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    'admin': 'bg-red-500/20 text-red-300 border-red-400/30',
    'default': 'bg-secondary text-secondary-foreground'
  };
  
  const getRankStyle = (rank: string) => {
    const rankLower = rank.toLowerCase();
    return rankStyles[rankLower] || rankStyles['default'];
  }

  return (
    <>
      <div className="text-center mb-8 flex items-center justify-center gap-4">
        <Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2 h-4 w-4" /> Add New Staff</Button>
        <HoverEffectsGuide />
      </div>

      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setEditingStaff(undefined); } setIsFormOpen(open); }}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="p-6 pb-0">
              <DialogTitle>{editingStaff ? 'Edit' : 'Add'} Staff Member</DialogTitle>
              <CardDescription>Manage the details for your team members.</CardDescription>
          </DialogHeader>
          <StaffForm staffMember={editingStaff} onSave={handleFormSave} />
        </DialogContent>
      </Dialog>
      
      {isLoading ? (
        <p className="text-center">Loading staff...</p>
      ) : staff && staff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {staff.map((member, index) => (
            <Card key={member.id} className={cn("flex flex-col text-center items-center transition-all duration-300 relative group animate-slide-in", member.hoverEffect)} style={{animationDelay: `${index * 100}ms`}}>
              <div className="absolute top-2 right-2 flex gap-1 bg-background/50 backdrop-blur-sm rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleOpenForm(member)}><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDelete(member.id)}><Trash className="h-4 w-4 text-destructive" /></Button>
              </div>
              <CardHeader className="pt-8 w-full">
                {member.imageUrl && (
                  <Image src={member.imageUrl} alt={`${member.name}'s profile picture`} width={80} height={80} className="rounded-full border-4 border-primary/10 shadow-md mx-auto"/>
                )}
                <CardTitle className="text-2xl font-bold mt-4">{member.name}</CardTitle>
                <Badge className={cn("text-xs font-bold uppercase tracking-wider mx-auto border", getRankStyle(member.rank))}>
                  {member.rank.toLowerCase() === 'founder' && <Crown className="w-3 h-3 mr-1.5"/>}
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
        <p className="text-center text-muted-foreground col-span-full pt-12">No other staff members have been added yet.</p>
      )}
    </>
  )
}

function PublicStaffView() {
  const firestore = useFirestore();
  const staffQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "staff")) : null, [firestore]);
  const { data: staff, isLoading } = useCollection<StaffMember>(staffQuery);

  const rankStyles: { [key: string]: string } = {
    'developer': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    'founder': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    'admin': 'bg-red-500/20 text-red-300 border-red-400/30',
    'default': 'bg-secondary text-secondary-foreground'
  };
  
  const getRankStyle = (rank: string) => {
    const rankLower = rank.toLowerCase();
    return rankStyles[rankLower] || rankStyles['default'];
  }

  return (
     <div className="space-y-12">
        <Card className="w-full max-w-3xl mx-auto transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 border-2 border-accent">
            <CardHeader className="text-center items-center p-8">
              <Image src="https://hammadprofile.netlify.app/imagie/hammad.webp" alt="Hammad's Profile Picture" width={120} height={120} className="rounded-full mb-4 border-4 border-accent/30 shadow-lg"/>
              <CardTitle className="text-4xl font-black">Hammad</CardTitle>
              <Badge className={cn("text-sm font-bold uppercase tracking-wider border", getRankStyle('developer'))}>
                Developer
              </Badge>
            </CardHeader>
            <CardContent className="px-6">
              <Collapsible className="w-full">
                <div className="flex items-center justify-center"><CollapsibleTrigger asChild><Button variant="outline" className="mb-4">View Skills <ChevronsUpDown className="w-4 h-4 ml-2" /></Button></CollapsibleTrigger></div>
                <CollapsibleContent>
                  <div className="space-y-6 rounded-lg border p-6 bg-background/50">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pt-12">
              {staff.map((member, index) => (
                <Card key={member.id} className={cn("flex flex-col text-center items-center transition-all duration-300 relative group animate-slide-in", member.hoverEffect)} style={{animationDelay: `${index * 100}ms`}}>
                  <CardHeader className="pt-8 w-full">
                    {member.imageUrl && (
                      <Image src={member.imageUrl} alt={`${member.name}'s profile picture`} width={80} height={80} className="rounded-full border-4 border-primary/10 shadow-md mx-auto"/>
                    )}
                    <CardTitle className="text-2xl font-bold mt-4">{member.name}</CardTitle>
                    <Badge className={cn("text-xs font-bold uppercase tracking-wider mx-auto border", getRankStyle(member.rank))}>
                      {member.rank.toLowerCase() === 'founder' && <Crown className="w-3 h-3 mr-1.5"/>}
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
            <p className="text-center text-muted-foreground col-span-full pt-12">No other staff members have been added yet.</p>
          )}
        </div>
  )
}

export function Staff() {
  const { user } = useUser();
  const { toast } = useToast();
  const { setMainTab } = useTabStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<StaffView>('dashboard');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("isStaffAdminAuthenticated");
    if (sessionAuth === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isStaffAdminAuthenticated");
    setIsAuthenticated(false);
    setActiveView('dashboard');
    toast({ title: "Logged out", description: "You have been logged out from the staff panel." });
  };
  
  const renderContent = () => {
    if (!isAuthenticated) {
      return <PublicStaffView />;
    }
    
    switch (activeView) {
      case 'dashboard':
        return (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Staff Dashboard</CardTitle>
              <CardDescription>Select a tool to get started.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
              <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveView('manage')}>
                <Users className="w-6 h-6"/>
                Manage Team
              </Button>
               <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveView('guide')}>
                <BookOpen className="w-6 h-6"/>
                Staff Guide
              </Button>
               <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveView('chat')}>
                <MessageSquare className="w-6 h-6"/>
                Staff Chat
              </Button>
               <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => setActiveView('presents')}>
                <Gift className="w-6 h-6"/>
                Staff Presents
              </Button>
            </CardContent>
             <CardFooter className="justify-center">
              <Button variant="ghost" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
            </CardFooter>
          </Card>
        );
      case 'manage':
        return (
            <div>
                <Button variant="outline" onClick={() => setActiveView('dashboard')} className="mb-6"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Dashboard</Button>
                <TeamManagement />
            </div>
        );
      case 'guide':
        return <StaffGuide onBack={() => setActiveView('dashboard')} />;
      case 'chat':
        return <StaffChat onBack={() => setActiveView('dashboard')} />;
      case 'presents':
        return <StaffPresents onBack={() => setActiveView('dashboard')} />;
      default:
        return <PublicStaffView />;
    }
  }


  return (
    <section id="staff" className="w-full py-16 md:py-24 relative">
      {!isAuthenticated && <StaffAdminLogin onLogin={handleLogin} />}
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Our Staff</h2>
           <CardDescription className="max-w-2xl mx-auto !text-lg">
            Meet the dedicated team that keeps Cloudverse running.
          </CardDescription>
        </div>
        
        {renderContent()}

      </div>
    </section>
  );
}
