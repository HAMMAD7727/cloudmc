
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAuth,
  useUser,
  useFirestore,
  useCollection,
  useDoc,
  useMemoFirebase,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  type WithId,
} from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, query, orderBy, limit, doc, writeBatch } from "firebase/firestore";
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

const profileSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters.")
    .max(15, "Display name cannot exceed 15 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed."),
});
type ProfileFormValues = z.infer<typeof profileSchema>;


type ChatMessage = {
  text: string;
  userId: string;
  displayName: string;
  createdAt: string;
};

type UserProfile = {
    displayName: string;
}

const STAFF_UIDS = ["P6abiBvo6JXPb27SbI90o7GBPIA2", "6uLUcUb6abZURBBWShZcZKcDdy12"];

function UpdateProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit: SubmitHandler<ProfileFormValues> = async ({ displayName }) => {
    if (!firestore || !user) return;
    
    const profileRef = doc(firestore, "users", user.uid);

    try {
        const batch = writeBatch(firestore);
        batch.set(profileRef, { displayName });
        await batch.commit();
        toast({ title: "Profile Updated!", description: "Your display name has been set." });
    } catch (error: any) {
         if(error.code === 'permission-denied') {
            toast({ variant: "destructive", title: "Display Name Taken", description: "That display name is already in use. Please choose another." });
         } else {
            toast({ variant: "destructive", title: "Error", description: "Could not update profile." });
         }
    }
  };

  return (
    <div className="text-center p-8 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
        <p className="text-muted-foreground mb-4">Please set your display name to start chatting.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
            <Input {...register("displayName")} placeholder="Choose a display name" />
            {errors.displayName && <p className="text-destructive text-sm">{errors.displayName.message}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Saving..." : "Save Display Name"}
            </Button>
        </form>
    </div>
  )
}

function ChatMessages() {
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
  const reversedMessages = useMemo(() => messages ? [...messages].reverse() : [], [messages]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reversedMessages]);

  if (isLoading) return <p>Loading messages...</p>;

  return (
    <div className="h-96 overflow-y-auto p-4 border rounded-md space-y-4 bg-muted/20">
      {reversedMessages && reversedMessages.length > 0 ? (
        reversedMessages.map((msg) => {
          const isStaff = STAFF_UIDS.includes(msg.userId);
          return (
            <div key={msg.id} className="flex flex-col items-start">
               <div className="flex items-center gap-2">
                <span className="font-bold">{msg.displayName}</span>
                {isStaff && <Badge variant="secondary">Staff</Badge>}
               </div>
              <p className="bg-background p-2 rounded-lg shadow-sm">{msg.text}</p>
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
        toast({ title: "Success", description: "Account created! Please choose a display name." });
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

  const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });

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
    if (!firestore || !user || !userProfile) return;
    const messageData = {
      text,
      userId: user.uid,
      displayName: userProfile.displayName,
      createdAt: new Date().toISOString(),
    };
    const messagesCollection = collection(firestore, "chat_messages");
    await addDocumentNonBlocking(messagesCollection, messageData);
    reset();
  };

  if (isUserLoading || isProfileLoading) return <p>Loading chat...</p>;

  if (!user) {
    return <ChatAuth />;
  }

  if (!userProfile) {
    return <UpdateProfileForm />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p>Logged in as <span className="font-bold">{userProfile.displayName}</span></p>
        <Button onClick={handleSignOut} variant="outline" size="sm">Sign Out</Button>
      </div>
      <ChatMessages />
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <Input {...register("text")} placeholder="Type your message..." autoComplete="off" />
        <Button type="submit" disabled={isSubmitting}>
          Send
        </Button>
      </form>
    </div>
  );
}
