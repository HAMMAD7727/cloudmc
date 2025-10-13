import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, Ticket, Users } from "lucide-react";
import Link from "next/link";

export default function PurchasePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
         <Card className="shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary">
                Purchase Instructions
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                Follow these steps to complete your purchase.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 border rounded-lg bg-primary/5">
                    <div className="flex-shrink-0">
                        <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl shadow-lg">1</div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-semibold mb-2">Join our Discord Server</h3>
                        <p className="text-muted-foreground mb-4">Click the button below to join our community and connect with staff.</p>
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white group">
                            <Link href="https://discord.gg/UNaPb7SYyf" target="_blank">
                                <svg className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.36981C18.699 3.50425 16.962 2.86175 15.129 2.49881C14.991 2.74281 14.833 3.00381 14.695 3.25081C12.793 2.92481 10.993 2.92481 9.125 3.25081C8.987 3.00381 8.829 2.74281 8.691 2.49881C6.858 2.86175 5.122 3.50425 3.504 4.36981C0.375 8.05381 -0.422 11.5948 0.171 15.0608C1.832 16.2648 3.543 17.1358 5.263 17.7598C5.552 17.2628 5.808 16.7498 6.031 16.2238C5.293 15.9078 4.582 15.5418 3.903 15.1158C4.011 15.0118 4.115 14.9038 4.218 14.7958C7.599 16.6328 11.428 17.4768 15.129 17.7598C15.352 16.7498 15.556 15.7258 15.728 14.6968C15.556 14.6438 15.385 14.5918 15.213 14.5378C15.042 14.4848 14.877 14.4268 14.706 14.3688C14.535 14.3108 14.37 14.2478 14.205 14.1848C11.353 13.5288 9.032 11.9698 9.032 11.9698C9.032 11.9698 9.448 12.4498 10.027 12.8648C10.046 12.8758 10.065 12.8878 10.084 12.8998C12.394 14.1458 14.57 14.6018 16.632 14.7958C16.74 14.9038 16.843 15.0118 16.942 15.1158C16.263 15.5418 15.552 15.9078 14.814 16.2238C15.037 16.7498 15.293 17.2628 15.582 17.7598C17.302 17.1358 18.992 16.2648 20.653 15.0608C21.284 11.2388 20.317 7.71181 20.317 4.36981ZM8.021 12.3368C7.023 12.3368 6.206 11.4748 6.206 10.4208C6.206 9.36681 7.011 8.50481 8.021 8.50481C9.031 8.50481 9.847 9.36681 9.838 10.4208C9.838 11.4748 9.031 12.3368 8.021 12.3368ZM15.808 12.3368C14.81 12.3368 13.993 11.4748 13.993 10.4208C13.993 9.36681 14.799 8.50481 15.808 8.50481C16.818 8.50481 17.635 9.36681 17.626 10.4208C17.626 11.4748 16.818 12.3368 15.808 12.3368Z" /></svg>
                                Join Discord
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                    <hr className="w-full border-border" />
                    <ChevronRight className="w-8 h-8 flex-shrink-0" />
                    <hr className="w-full border-border" />
                </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                             <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl shadow-lg">2</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Ticket className="w-6 h-6 text-primary"/>Create a Ticket</h3>
                            <p className="text-muted-foreground">Find the <code className="bg-muted px-1.5 py-0.5 rounded-sm">#support</code> or <code className="bg-muted px-1.5 py-0.5 rounded-sm">#create-ticket</code> channel and open a new ticket for your purchase.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-2xl shadow-lg">3</div>
                        </div>
                        <div>
                             <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Users className="w-6 h-6 text-primary"/>Contact Staff</h3>
                            <p className="text-muted-foreground">In the ticket, ping a staff member (<code className="bg-muted px-1.5 py-0.5 rounded-sm">@Staff</code>) or wait for them to respond to complete your purchase.</p>
                        </div>
                    </div>
                 </div>

                 <div className="text-center pt-6">
                    <p className="text-lg font-semibold">Alternatively, create a ticket right here on the website!</p>
                    <Button asChild size="lg" className="mt-4">
                        <Link href="/#support">Create a Ticket on Website</Link>
                    </Button>
                 </div>
            </CardContent>
         </Card>
         <div className="mt-6 text-center">
            <Button variant="link" asChild>
                <Link href="/">Back to Store</Link>
            </Button>
         </div>
      </div>
    </div>
  );
}
