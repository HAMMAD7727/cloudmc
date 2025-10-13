"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAuth,
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  type WithId,
} from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty.").max(500),
});
type MessageFormValues = z.infer<typeof messageSchema>;

const authSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type AuthFormValues = z.infer<typeof authSchema>;

type ChatMessage = {
  text: string;
  userId: string;
  userEmail: string;
  createdAt: string;
};

type StaffMember = {
  email: string;
  name: string;
  rank: string;
};

function ChatMessages({ staffMembers }: { staffMembers: WithId<StaffMember>[] }) {
  const firestore = useFirestore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, "chat_messages"),
            orderBy("createdAt", "desc"),
            limit(50)
          )
        : null,
    [firestore]
  );
  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);
  const reversedMessages = useMemoFirebase(() => messages ? [...messages].reverse() : [], [messages]);
  
  const getStaffRank = (email: string) => {
    const staff = staffMembers.find(s => s.email === email);
    return staff ? staff.rank : null;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reversedMessages]);

  if (isLoading) return <p>Loading messages...</p>;

  return (
    <div className="h-96 overflow-y-auto p-4 border rounded-md space-y-4 bg-muted/20">
      {reversedMessages && reversedMessages.length > 0 ? (
        reversedMessages.map((msg) => {
          const staffRank = getStaffRank(msg.userEmail);
          return (
            <div key={msg.id} className="flex flex-col items-start">
               <div className="flex items-center gap-2">
                <span className="font-bold">{msg.userEmail.split('@')[0]}</span>
                {staffRank && <Badge variant="secondary">{staffRank}</Badge>}
               </div>
              <p className="bg-white p-2 rounded-lg shadow-sm">{msg.text}</p>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
              </span>
            </div>
          );
        })
      ) : (
        <p>No messages yet. Be the first to say something!</p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function ChatAuth() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const auth = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthFormValues> = async ({ email, password }) => {
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Success", description: "Signed up successfully!" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Success", description: "Logged in successfully!" });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="text-center p-8 border rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        {isSigningUp ? "Create an Account" : "Log In"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
        <Input {...register("email")} placeholder="Email" />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        <Input {...register("password")} type="password" placeholder="Password" />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? "Processing..."
            : isSigningUp
            ? "Sign Up"
            : "Log In"}
        </Button>
      </form>
      <Button
        variant="link"
        onClick={() => setIsSigningUp(!isSigningUp)}
        className="mt-4"
      >
        {isSigningUp
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </Button>
    </div>
  );
}


export function LiveChat() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });

  const staffQuery = useMemoFirebase(() => firestore ? collection(firestore, "staff") : null, [firestore]);
  const { data: staffMembers } = useCollection<StaffMember>(staffQuery);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log out.",
      });
    }
  };

  const onSubmit: SubmitHandler<MessageFormValues> = async ({ text }) => {
    if (!firestore || !user) return;
    const messageData = {
      text,
      userId: user.uid,
      userEmail: user.email!,
      createdAt: new Date().toISOString(),
    };
    const messagesCollection = collection(firestore, "chat_messages");
    await addDocumentNonBlocking(messagesCollection, messageData);
    reset();
  };

  if (isUserLoading || !staffMembers) return <p>Loading chat...</p>;

  if (!user) {
    return <ChatAuth />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p>Logged in as <span className="font-bold">{user.email}</span></p>
        <Button onClick={handleSignOut} variant="outline" size="sm">Sign Out</Button>
      </div>
      <ChatMessages staffMembers={staffMembers} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <Input {...register("text")} placeholder="Type your message..." autoComplete="off" />
        <Button type="submit" disabled={isSubmitting}>
          Send
        </Button>
      </form>
    </div>
  );
}
