
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase, useAuth, initiateAnonymousSignIn, useUser } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { WithId } from "@/firebase";
import { useTabStore } from "@/lib/tab-store";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type FeedbackEntry = {
  playerName: string;
  rating: number;
  message: string;
  submissionDate: string;
};

function AdminDashboard() {
  const firestore = useFirestore();
  const feedbackCollection = useMemoFirebase(() => firestore ? query(collection(firestore, "feedback")) : null, [firestore]);
  const { data: feedback, isLoading } = useCollection<FeedbackEntry>(feedbackCollection);
  const { setMainTab } = useTabStore();

  const handleNavigate = (tab: string) => {
    setMainTab(tab);
  };

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Management Links</CardTitle>
          <CardDescription>Quick links to manage different parts of the store.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/#ranks" passHref>
            <Button variant="outline" className="w-full justify-between" onClick={() => handleNavigate('ranks')}>Ranks <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link href="/#features" passHref>
            <Button variant="outline" className="w-full justify-between" onClick={() => handleNavigate('features')}>Features <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link href="/#news" passHref>
            <Button variant="outline" className="w-full justify-between" onClick={() => handleNavigate('news')}>News <ArrowRight className="w-4 h-4" /></Button>
          </Link>
          <Link href="/#staff" passHref>
            <Button variant="outline" className="w-full justify-between" onClick={() => handleNavigate('staff')}>Staff <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Admin Panel - Feedback</CardTitle>
            <CardDescription>Latest feedback submitted by users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {feedback && feedback.length > 0 ? (
            feedback.map((item: WithId<FeedbackEntry>) => (
                <Card key={item.id} className="transform hover:-translate-y-1 transition-transform duration-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{item.playerName}</CardTitle>
                        <CardDescription>
                        {new Date(item.submissionDate).toLocaleString()}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-5 h-5 ${
                            i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.363 2.445a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.362-2.445a1 1 0 00-1.176 0l-3.362 2.445c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                        ))}
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{item.message}</p>
                </CardContent>
                </Card>
            ))
            ) : (
            <p>No feedback submitted yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function AdminPage() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === "hammadisjassi") {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAdminAuthenticated", "true");
      toast({ title: "Success!", description: "Welcome to the Admin Dashboard." });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Incorrect password." });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("isAdminAuthenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary font-headline">
            Admin Panel
          </CardTitle>
           <CardDescription className="text-center !text-base">Enter the password to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
          />
           <Button onClick={handleLogin} className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
