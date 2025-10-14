
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
import { PlusCircle, Edit, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  emoji: z.string().min(1, "Please select an emoji."),
  color: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

type NewsItem = {
  title: string;
  content: string;
  date: string;
  emoji: string;
  color?: string;
  adminKey?: string;
};

const NEWS_EMOJIS = ["📰", "✨", "🎉", "📢", "🚀", "💡", "🔥", "💯"];

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async () => {
    if (password === "hammadisjassi") {
      try {
        await initiateAnonymousSignIn(auth);
        sessionStorage.setItem("isNewsAdminAuthenticated", "true");
        onLogin();
        toast({ title: "Success", description: "Logged in as news admin." });
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
        <DialogHeader><DialogTitle>News Admin Login</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyUp={(e) => e.key === 'Enter' && handleLogin()}/>
        </div>
        <DialogFooter><DialogClose asChild><Button onClick={handleLogin}>Login</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewsForm({ newsItem, onSave }: { newsItem?: WithId<NewsItem>; onSave: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: newsItem?.title || "",
      content: newsItem?.content || "",
      emoji: newsItem?.emoji || "",
      color: newsItem?.color || "",
    },
  });

  const onSubmit: SubmitHandler<NewsFormValues> = async (data) => {
    if (!firestore) return;
    try {
      const newsData = {
        ...data,
        date: new Date().toISOString(),
        adminKey: "hammadisjassi",
      };

      if (newsItem) {
        await setDocumentNonBlocking(doc(firestore, "news_items", newsItem.id), newsData, { merge: true });
        toast({ title: "News Updated!", description: `"${data.title}" has been updated.` });
      } else {
        await addDocumentNonBlocking(collection(firestore, "news_items"), newsData);
        toast({ title: "News Added!", description: `"${data.title}" has been published.` });
      }
      reset();
      onSave();
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "An error occurred." });
    }
  };
  
  return (
    <div className="max-h-[80vh] overflow-y-auto p-1 pr-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="Enter the news title" />
                {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" {...register("content")} placeholder="Write the news content here..." rows={6} />
                {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="emoji">Emoji</Label>
                    <Select onValueChange={(value) => setValue('emoji', value, {shouldValidate: true})} value={watch('emoji')}>
                        <SelectTrigger id="emoji">
                            <SelectValue placeholder="Select an emoji" />
                        </SelectTrigger>
                        <SelectContent>
                            {NEWS_EMOJIS.map(emoji => (
                                <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     {errors.emoji && <p className="text-destructive text-sm">{errors.emoji.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="color">Highlight Color (optional)</Label>
                    <Input id="color" {...register("color")} type="color" className="p-1"/>
                </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save News"}
                </Button>
            </DialogFooter>
        </form>
    </div>
  );
}


export function News() {
  const firestore = useFirestore();
  const newsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "news_items"), orderBy("date", "desc")) : null, [firestore]);
  const { data: newsItems, isLoading } = useCollection<NewsItem>(newsQuery);
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<WithId<NewsItem> | undefined>(undefined);

  useEffect(() => {
    if (sessionStorage.getItem("isNewsAdminAuthenticated") === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => setIsAuthenticated(true);
  
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingNews(undefined);
  };
  
  const handleOpenForm = (item?: WithId<NewsItem>) => {
    setEditingNews(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: WithId<NewsItem>) => {
    if (!firestore || !window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
        await deleteDocumentNonBlocking(doc(firestore, "news_items", item.id));
        toast({ title: "Success", description: "News item deleted." });
    } catch(e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete news item." });
    }
  };


  return (
    <section id="news" className="w-full py-12 md:py-20 relative">
      {!isAuthenticated && <AdminLogin onLogin={handleLogin} />}

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Latest News</h2>
          <CardDescription className="max-w-2xl mx-auto !text-base">
            Stay up-to-date with the latest changes and events.
          </CardDescription>
        </div>
        
        {isAuthenticated && (
          <div className="text-center mb-8">
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add News Item
            </Button>
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) { setEditingNews(undefined); } setIsFormOpen(open); }}>
          <DialogContent className="max-w-2xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{editingNews ? 'Edit' : 'Add'} News Item</DialogTitle>
            </DialogHeader>
            <NewsForm newsItem={editingNews} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>

        <div className="max-w-3xl mx-auto space-y-8">
          {isLoading && <p className="text-center">Loading news...</p>}
          {!isLoading && newsItems?.length === 0 && <p className="text-center text-muted-foreground">No news has been posted yet.</p>}
          {newsItems?.map((item) => (
            <Card key={item.id} className="w-full shadow-md transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-primary/20 hover:shadow-2xl relative" style={{ borderColor: item.color || 'hsl(var(--border))' }}>
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
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-full transition-colors text-3xl")} style={{ backgroundColor: item.color ? `${item.color}33` : 'hsl(var(--primary) / 0.1)' }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                    <CardDescription>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
