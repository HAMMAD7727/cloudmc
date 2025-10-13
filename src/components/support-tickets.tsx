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
import { collection, query, where, orderBy, doc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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


const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type TicketFormValues = z.infer<typeof ticketSchema>;

const replySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty."),
});
type ReplyFormValues = z.infer<typeof replySchema>;

type Ticket = {
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "closed" | "in-progress";
  createdAt: string;
  replies: {
    userId: string;
    userEmail: string;
    message: string;
    createdAt: string;
    isStaff: boolean;
  }[];
};

const STAFF_UIDS = ["P6abiBvo6JXPb27SbI90o7GBPIA2", "6uLUcUb6abZURBBWShZcZKcDdy12"];

function CreateTicketForm({ onTicketCreated }: { onTicketCreated: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit: SubmitHandler<TicketFormValues> = async (data) => {
    if (!firestore || !user || !user.email) {
        toast({ variant: "destructive", title: "Error", description: "You must be logged in to create a ticket." });
        return;
    };
    const newTicket = {
      ...data,
      userId: user.uid,
      userEmail: user.email,
      status: "open" as const,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    await addDocumentNonBlocking(collection(firestore, "support_tickets"), newTicket);
    toast({ title: "Success", description: "Your support ticket has been created." });
    reset();
    onTicketCreated();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("subject")} placeholder="Subject" />
          {errors.subject && (
            <p className="text-destructive text-sm">{errors.subject.message}</p>
          )}
          <Textarea {...register("message")} placeholder="Describe your issue..." rows={5} />
          {errors.message && (
            <p className="text-destructive text-sm">{errors.message.message}</p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Create Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReplyForm({ ticket, onReplied }: { ticket: WithId<Ticket>, onReplied: () => void; }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ReplyFormValues>({
        resolver: zodResolver(replySchema),
    });
    
    const isStaff = user ? STAFF_UIDS.includes(user.uid) : false;


    const onSubmit: SubmitHandler<ReplyFormValues> = async (data) => {
        if (!firestore || !user || !user.email) return;

        const ticketRef = doc(firestore, "support_tickets", ticket.id);
        
        const newReply = {
            message: data.reply,
            userId: user.uid,
            userEmail: user.email,
            createdAt: new Date().toISOString(),
            isStaff: isStaff
        };
        
        const updatedReplies = [...ticket.replies, newReply];
        
        updateDocumentNonBlocking(ticketRef, {
            replies: updatedReplies,
            status: isStaff ? "in-progress" : ticket.status
        });

        toast({ title: "Reply Sent" });
        reset();
        onReplied();
    };

    if (ticket.status === 'closed') {
        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2">
            <Input {...register("reply")} placeholder="Type your reply..." />
            <Button type="submit" disabled={isSubmitting}>Reply</Button>
        </form>
    );
}

function TicketActions({ ticket }: { ticket: WithId<Ticket> }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const isStaff = user ? STAFF_UIDS.includes(user.uid) : false;

    const handleStatusChange = (status: "open" | "closed" | "in-progress") => {
        if (!firestore) return;
        const ticketRef = doc(firestore, "support_tickets", ticket.id);
        updateDocumentNonBlocking(ticketRef, { status });
    };

    if (!isStaff) return null;

    return (
        <div className="flex gap-2">
            {ticket.status !== 'closed' && <Button variant="destructive" onClick={() => handleStatusChange('closed')}>Close Ticket</Button>}
            {ticket.status !== 'open' && <Button variant="outline" onClick={() => handleStatusChange('open')}>Re-open Ticket</Button>}
        </div>
    )
}


function TicketList() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const isStaff = user ? STAFF_UIDS.includes(user.uid) : false;
  
  const ticketsQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      // Admins can list all tickets, sorted by date
      if (isStaff) {
        return query(collection(firestore, "support_tickets"), orderBy("createdAt", "desc"));
      }
      // Regular users can only list their own tickets, filtered by userId
      return query(
        collection(firestore, "support_tickets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
    }, [firestore, user, isStaff]);

  const { data: tickets, isLoading } = useCollection<Ticket>(ticketsQuery);

  if (isLoading) return <p>Loading tickets...</p>;
  if (!tickets || tickets.length === 0) return <p className="text-center mt-8">No tickets found.</p>;

  return (
    <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{isStaff ? "All Support Tickets" : "Your Tickets"}</h3>
        <Accordion type="single" collapsible className="w-full space-y-4">
        {tickets.map((ticket) => (
            <AccordionItem value={ticket.id} key={ticket.id} className="border rounded-lg bg-card">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                        <div className="text-left">
                            <p className="font-bold">{ticket.subject}</p>
                            <p className="text-sm text-muted-foreground">{isStaff ? `From: ${ticket.userEmail}`: ''}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant={ticket.status === 'open' ? 'default' : ticket.status === 'closed' ? 'destructive' : 'secondary'}>{ticket.status}</Badge>
                            <span className="text-sm text-muted-foreground hidden md:inline">{format(new Date(ticket.createdAt), "PPP")}</span>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t">
                    <div className="space-y-4">
                        <p><strong className="font-medium">Original Message:</strong> {ticket.message}</p>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Replies:</h4>
                            {ticket.replies.length > 0 ? ticket.replies.map((reply, index) => (
                                <div key={index} className={`p-3 rounded-md ${reply.isStaff ? 'bg-primary/10' : 'bg-muted/50'}`}>
                                    <p className="font-bold flex items-center gap-2">
                                        {reply.userEmail.split('@')[0]}
                                        {reply.isStaff && <Badge variant="secondary">Staff</Badge>}
                                    </p>
                                    <p className="text-foreground/90">{reply.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</p>
                                </div>
                            )) : <p className="text-muted-foreground">No replies yet.</p>}
                        </div>
                         <ReplyForm ticket={ticket} onReplied={() => {}} />
                         <TicketActions ticket={ticket} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
        </Accordion>
    </div>
  );
}

export function SupportTickets() {
  const { user } = useUser();
  const [showCreate, setShowCreate] = useState(false);

  if (!user) {
    return <p className="text-center">Please log in to create or view support tickets.</p>;
  }
  
  return (
    <div>
      {!showCreate && (
        <div className="text-center">
            <Button onClick={() => setShowCreate(true)}>Create New Ticket</Button>
        </div>
      )}
      {showCreate && <CreateTicketForm onTicketCreated={() => setShowCreate(false)} />}
      
      <TicketList />
    </div>
  );
}
