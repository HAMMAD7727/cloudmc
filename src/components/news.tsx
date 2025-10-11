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
  orderBy,
} from "firebase/firestore";
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  initiateAnonymousSignIn,
  useAuth,
  useUser,
  type WithId,
} from "@/firebase";
import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Newspaper, Edit, Trash, PlusCircle } from "lucide-react";

const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
});

type NewsFormValues = z.infer<typeof newsSchema>;

type NewsItem = {
  title: string;
  content: string;
  date: string;
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = () => {
    if (password === "hammadisjassi") {
      initiateAnonymousSignIn(auth);
      sessionStorage.setItem("isNewsAdminAuthenticated", "true");
      onLogin();
      toast({ title: "Success", description: "Logged in as news admin." });
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
          <DialogTitle>News Admin Login</DialogTitle>
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

function NewsForm({ newsItem, onSave }: { newsItem?: WithId<NewsItem>; onSave: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: newsItem?.title || "",
      content: newsItem?.content || "",
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
        const newsDocRef = doc(firestore, "news_items", newsItem.id);
        await setDocumentNonBlocking(newsDocRef, newsData, { merge: true });
        toast({ title: "News Updated!", description: `"${data.title}" has been updated.` });
      } else {
        const newsCollection = collection(firestore, "news_items");
        await addDocumentNonBlocking(newsCollection, newsData);
        toast({ title: "News Added!", description: `"${data.title}" has been published.` });
      }
      reset();
      onSave();
    } catch (error) {
       toast({ variant: "destructive", title: "Uh oh!", description: "Could not save the news item." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("title")} placeholder="News Title" />
      {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}

      <Textarea {...register("content")} placeholder="News Content" rows={5} />
      {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save News"}
        </Button>
      </DialogFooter>
    </form>
  );
}


export function News() {
  const firestore = useFirestore();
  const newsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, "news_items"), orderBy("date", "desc")) : null, [firestore]);
  const { data: newsItems, isLoading } = useCollection<NewsItem>(newsQuery);
  const { toast } = useToast();
  const { user } = useUser();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<WithId<NewsItem> | undefined>(undefined);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("isNewsAdminAuthenticated");
    if (sessionAuth === "true" && user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleFormSave = () => {
    setIsFormOpen(false);
    setEditingNewsItem(undefined);
  };
  
  const handleOpenForm = (item?: WithId<NewsItem>) => {
    setEditingNewsItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (newsItemId: string) => {
    if (!firestore || !window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await deleteDoc(doc(firestore, "news_items", newsItemId));
      toast({ title: "Success", description: "News item deleted successfully." });
    } catch (error) {
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
              <PlusCircle className="mr-2 h-4 w-4" /> Add New News
            </Button>
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNewsItem ? 'Edit' : 'Add'} News</DialogTitle>
            </DialogHeader>
            <NewsForm newsItem={editingNewsItem} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>

        <div className="max-w-3xl mx-auto space-y-8">
          {isLoading && <p className="text-center">Loading news...</p>}
          {newsItems && newsItems.length === 0 && !isLoading && <p className="text-center">No news posted yet.</p>}
          {newsItems?.map((item) => (
            <Card key={item.id} className="w-full shadow-md transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl relative">
              {isAuthenticated && (
                 <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenForm(item)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                 </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Newspaper className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                    <CardDescription>{new Date(item.date).toLocaleDateString()}</CardDescription>
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
