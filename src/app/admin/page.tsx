"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { WithId } from "@/firebase";

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

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Feedback</h1>
      <div className="space-y-4">
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
      </div>
    </div>
  );
}


export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check session storage for authentication status
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("isAdminAuthenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === "hammadcloudverse") {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAdminAuthenticated", "true"); // Store auth state in session
      toast({
        title: "Success",
        description: "Logged in to admin panel.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Incorrect password.",
      });
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary font-headline">
            Admin Panel
          </CardTitle>
           <CardDescription className="text-center !text-base">Enter password to access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
