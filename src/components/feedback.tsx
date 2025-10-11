"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addDocumentNonBlocking, useCollection, useFirestore, useMemoFirebase, type WithId } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

const feedbackSchema = z.object({
  playerName: z.string().min(3, "Player name must be at least 3 characters."),
  rating: z.number().min(1, "Please select a rating.").max(5),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

type FeedbackEntry = {
  playerName: string;
  rating: number;
  message: string;
  submissionDate: string;
};

function FeedbackList() {
  const firestore = useFirestore();
  const feedbackQuery = useMemoFirebase(() => 
    firestore 
      ? query(collection(firestore, "feedback"), orderBy("submissionDate", "desc"), limit(20)) 
      : null
  , [firestore]);
  const { data: feedback, isLoading } = useCollection<FeedbackEntry>(feedbackQuery);

  if (isLoading) {
    return <div className="text-center">Loading feedback...</div>;
  }
  
  if (!feedback || feedback.length === 0) {
    return <p className="text-center text-muted-foreground">No feedback submitted yet. Be the first!</p>
  }

  return (
     <div className="space-y-4">
        {feedback.map((item: WithId<FeedbackEntry>) => (
          <Card key={item.id} className="transform hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.playerName}</CardTitle>
                  <CardDescription>
                    {new Date(item.submissionDate).toLocaleString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
  )
}

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const firestore = useFirestore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      playerName: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
    if (!firestore) return;
    try {
      const feedbackCollection = collection(firestore, "feedback");
      await addDocumentNonBlocking(feedbackCollection, {
        ...data,
        submissionDate: new Date().toISOString(),
      });

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback. We appreciate it!",
      });
      reset();
      setRating(0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <section id="feedback" className="w-full py-12 md:py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Card className="w-full shadow-lg transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-primary/20 hover:shadow-2xl self-start">
              <CardHeader>
                <CardTitle className="text-3xl font-bold tracking-tight font-headline text-center">
                  Share Your Feedback
                </CardTitle>
                <CardDescription className="text-center !text-base">
                  We value your opinion. Let us know how we're doing!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Input
                      {...register("playerName")}
                      placeholder="Enter your player name"
                      className="bg-background"
                    />
                    {errors.playerName && (
                      <p className="text-sm text-destructive">
                        {errors.playerName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-center">
                    <label className="text-sm font-medium">Your Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-8 h-8 cursor-pointer transition-colors duration-200 hover:scale-110",
                            (hoverRating >= star || rating >= star)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted-foreground"
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            setRating(star);
                            setValue("rating", star, { shouldValidate: true });
                          }}
                        />
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-sm text-destructive">
                        {errors.rating.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      {...register("message")}
                      placeholder="Tell us what you think..."
                      rows={5}
                      className="bg-background"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full transition-transform duration-300 hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold tracking-tight font-headline">Community Feedback</h3>
                    <p className="text-muted-foreground">See what other players are saying.</p>
                </div>
                <FeedbackList />
            </div>
        </div>
      </div>
    </section>
  );
}
