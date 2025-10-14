
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  type WithId,
} from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  writeBatch,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ✅ Validation Schemas
const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type TicketFormValues = z.infer<typeof ticketSchema>;

const replySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty."),
});
type ReplyFormValues = z.infer<typeof replySchema>;

// ✅ Data Types
type Ticket = {
  userId: string;
  userEmail: string;
  subject: string;
  status: "open" | "closed" | "in-progress";
  createdAt: string;
};

type TicketMessage = {
  userId: string;
  userEmail: string;
  message: string;
  createdAt: string;
  isStaff: boolean;
};

// ✅ Admins / Staff
const STAFF_UIDS = [
  "P6abiBvo6JXPb27SbI90o7GBPIA2",
  "6uLUcUb6abZURBBWShZcZKcDdy12",
];

// -------------------------------------------------------------
// 🎫 Create Ticket Form
// -------------------------------------------------------------
function CreateTicketForm({ onTicketCreated }: { onTicketCreated: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({ resolver: zodResolver(ticketSchema) });

  const onSubmit: SubmitHandler<TicketFormValues> = async (data) => {
    if (!firestore || !user || !user.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to create a ticket.",
      });
      return;
    }

    try {
      const batch = writeBatch(firestore);
      const ticketRef = doc(collection(firestore, "support_tickets"));
      const newTicketData = {
        subject: data.subject,
        userId: user.uid,
        userEmail: user.email,
        status: "open" as const,
        createdAt: new Date().toISOString(),
      };
      batch.set(ticketRef, newTicketData);

      const messageRef = doc(collection(ticketRef, "messages"));
      const newMessageData = {
        message: data.message,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        isStaff: STAFF_UIDS.includes(user.uid),
      };
      batch.set(messageRef, newMessageData);

      await batch.commit();

      toast({ title: "Success", description: "Your support ticket has been created." });
      reset();
      onTicketCreated();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not create ticket." });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("subject")} placeholder="Subject" />
          {errors.subject && <p className="text-destructive text-sm">{errors.subject.message}</p>}
          <Textarea {...register("message")} placeholder="Describe your issue..." rows={5} />
          {errors.message && <p className="text-destructive text-sm">{errors.message.message}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


// -------------------------------------------------------------
// 💬 Reply Form
// -------------------------------------------------------------
function ReplyForm({ ticket, onReplySent }: { ticket: WithId<Ticket>; onReplySent: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
  });

  const onSubmit: SubmitHandler<ReplyFormValues> = async (data) => {
    if (!firestore || !user || !user.email) return;

    const messageRef = collection(firestore, "support_tickets", ticket.id, "messages");
    const newMessage = {
      message: data.reply,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      isStaff: STAFF_UIDS.includes(user.uid),
    };

    try {
      await addDocumentNonBlocking(messageRef, newMessage);
      toast({ title: "Reply Sent" });
      reset();
      onReplySent();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not send reply." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-2">
      <Textarea {...register("reply")} placeholder="Type your reply..." rows={3} />
      {errors.reply && <p className="text-destructive text-sm">{errors.reply.message}</p>}
      <div className="flex justify-end gap-2">
         {ticket.status !== 'closed' && (
             <Button
                type="button"
                variant="outline"
                onClick={async () => {
                    if(!firestore) return;
                    await updateDocumentNonBlocking(doc(firestore, "support_tickets", ticket.id), { status: "closed" })
                    toast({ title: "Ticket Closed"})
                }}
             >
                Close Ticket
            </Button>
         )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </form>
  );
}


// -------------------------------------------------------------
// 💬 Ticket Messages
// -------------------------------------------------------------
function TicketMessages({ ticketId }: { ticketId: string }) {
  const firestore = useFirestore();

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const messagesRef = collection(firestore, "support_tickets", ticketId, "messages");
    return query(messagesRef, orderBy("createdAt", "asc"));
  }, [firestore, ticketId]);

  const { data: messages, isLoading, error } = useCollection<TicketMessage>(messagesQuery);

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p className="text-destructive">Error loading messages.</p>;

  return (
    <div className="space-y-4 pt-4">
      <h4 className="font-semibold">Messages:</h4>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
        {messages && messages.length > 0 ? (
            messages.map((reply) => (
            <div key={reply.id} className={`p-3 rounded-lg ${reply.isStaff ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
                <p className="font-bold flex items-center gap-2">
                {reply.userEmail.split("@")[0]}
                {reply.isStaff && <Badge variant="secondary">Staff</Badge>}
                </p>
                <p className="text-foreground/90 whitespace-pre-wrap">{reply.message}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                </p>
            </div>
            ))
        ) : (
            <p className="text-muted-foreground">No messages yet.</p>
        )}
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// 📜 Ticket List
// -------------------------------------------------------------
function TicketList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const isStaff = user ? STAFF_UIDS.includes(user.uid) : false;

  const ticketsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    
    const ticketsRef = collection(firestore, "support_tickets");

    if (isStaff) {
      // Admins fetch all tickets
      return query(ticketsRef, orderBy("createdAt", "desc"));
    } else {
      // Normal users fetch only their own tickets
      return query(
        ticketsRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
    }
  }, [firestore, user, isStaff]);

  const { data: tickets, isLoading, error } = useCollection<Ticket>(ticketsQuery);

  if (isLoading) return <p>Loading tickets...</p>;
  if (error) {
    console.error(error);
    return <p className="text-destructive text-center mt-8">Error loading tickets. You may not have permission to view them.</p>;
  }
  if (!tickets || tickets.length === 0)
    return <p className="text-center text-muted-foreground mt-8">No tickets found.</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        {isStaff ? "All Support Tickets" : "Your Tickets"}
      </h3>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {tickets.map((ticket) => (
          <AccordionItem value={ticket.id} key={ticket.id} className="border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex justify-between items-center w-full gap-4">
                <div className="text-left">
                  <p className="font-bold truncate">{ticket.subject}</p>
                  {isStaff && (
                    <p className="text-sm text-muted-foreground">
                      From: {ticket.userEmail}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Badge
                    variant={
                      ticket.status === "open"
                        ? "default"
                        : ticket.status === "closed"
                        ? "destructive"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {ticket.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    {format(new Date(ticket.createdAt), "PPP")}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 border-t">
              <TicketMessages ticketId={ticket.id} />
               <ReplyForm ticket={ticket} onReplySent={() => {}} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// -------------------------------------------------------------
// 🧾 Main Export
// -------------------------------------------------------------
export function SupportTickets() {
  const { user } = useUser();
  const [showCreate, setShowCreate] = useState(false);

  if (!user) {
    return <p className="text-center text-muted-foreground">Please log in to create or view support tickets.</p>;
  }

  return (
    <div className="space-y-6">
        {!showCreate && (
             <Card className="text-center p-6 bg-primary/5 border-dashed">
                <CardHeader>
                    <CardTitle>Need Assistance?</CardTitle>
                    <CardDescription>
                        Create a new support ticket and our staff will get back to you shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setShowCreate(true)}>Create New Ticket</Button>
                </CardContent>
            </Card>
        )}
      
       {showCreate && <CreateTicketForm onTicketCreated={() => setShowCreate(false)} />}
      <TicketList />
    </div>
  );
}

    