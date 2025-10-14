
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Users, FileText, Shield, Database } from "lucide-react";
import Link from "next/link";
import { TermsDialog } from "./terms-dialog";
import { PrivacyDialog } from "./privacy-dialog";
import { DataUsageDialog } from "./data-usage-dialog";


export function HomeContent() {

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 space-y-16">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight font-headline animate-slide-in">Welcome to the official Cloudverse Store</h2>
            <p className="text-lg text-muted-foreground">
              Cloudverse is a free-to-play Public Minecraft Server. This is the official store where you can purchase ranks, coins, and other items to enhance your gameplay experience and grant you special perks.
            </p>
             <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        All payments are final and non-refundable. Attempting a chargeback or opening a PayPal dispute will result in permanent and irreversible banishment from all of our servers, and other Minecraft stores.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        All purchases are handled by staff through our official Discord server.
                    </p>
                </CardContent>
             </Card>
          </div>
          <Card className="transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/20 bg-accent/5 border-accent/20">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full w-fit mb-2">
                <ShoppingCart className="w-8 h-8 text-accent"/>
              </div>
              <CardTitle className="font-bold text-2xl text-accent">How to Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                To buy an item, please join our Discord server. Our staff will contact you to handle the payment and delivery of your items in-game.
              </p>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white group">
                <Link href="https://discord.gg/UNaPb7SYyf" target="_blank">
                    <svg className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.36981C18.699 3.50425 16.962 2.86175 15.129 2.49881C14.991 2.74281 14.833 3.00381 14.695 3.25081C12.793 2.92481 10.993 2.92481 9.125 3.25081C8.987 3.00381 8.829 2.74281 8.691 2.49881C6.858 2.86175 5.122 3.50425 3.504 4.36981C0.375 8.05381 -0.422 11.5948 0.171 15.0608C1.832 16.2648 3.543 17.1358 5.263 17.7598C5.552 17.2628 5.808 16.7498 6.031 16.2238C5.293 15.9078 4.582 15.5418 3.903 15.1158C4.011 15.0118 4.115 14.9038 4.218 14.7958C7.599 16.6328 11.428 17.4768 15.129 17.7598C15.352 16.7498 15.556 15.7258 15.728 14.6968C15.556 14.6438 15.385 14.5918 15.213 14.5378C15.042 14.4848 14.877 14.4268 14.706 14.3688C14.535 14.3108 14.37 14.2478 14.205 14.1848C11.353 13.5288 9.032 11.9698 9.032 11.9698C9.032 11.9698 9.448 12.4498 10.027 12.8648C10.046 12.8758 10.065 12.8878 10.084 12.8998C12.394 14.1458 14.57 14.6018 16.632 14.7958C16.74 14.9038 16.843 15.0118 16.942 15.1158C16.263 15.5418 15.552 15.9078 14.814 16.2238C15.037 16.7498 15.293 17.2628 15.582 17.7598C17.302 17.1358 18.992 16.2648 20.653 15.0608C21.284 11.2388 20.317 7.71181 20.317 4.36981ZM8.021 12.3368C7.023 12.3368 6.206 11.4748 6.206 10.4208C6.206 9.36681 7.011 8.50481 8.021 8.50481C9.031 8.50481 9.847 9.36681 9.838 10.4208C9.838 11.4748 9.031 12.3368 8.021 12.3368ZM15.808 12.3368C14.81 12.3368 13.993 11.4748 13.993 10.4208C13.993 9.36681 14.799 8.50481 15.808 8.50481C16.818 8.50481 17.635 9.36681 17.626 10.4208C17.626 11.4748 16.818 12.3368 15.808 12.3368Z" /></svg>
                    Join our Community
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-black">Legal Information</CardTitle>
            <CardDescription className="!text-lg">Review our terms and policies before making a purchase.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-2 p-6 rounded-lg bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center gap-3 font-semibold text-lg">
                    <FileText className="w-6 h-6 text-primary"/>
                    Terms & Conditions
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">
                    These terms govern your use of our webstore and the purchase of any products.
                  </p>
                  <TermsDialog />
              </div>
               <div className="flex flex-col gap-2 p-6 rounded-lg bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center gap-3 font-semibold text-lg">
                    <Shield className="w-6 h-6 text-primary"/>
                    Privacy Policy
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Learn how we collect, use, and protect your personal data.
                  </p>
                  <PrivacyDialog />
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-lg bg-card/50 hover:bg-card transition-colors">
                  <div className="flex items-center gap-3 font-semibold text-lg">
                    <Database className="w-6 h-6 text-primary"/>
                    Data Usage
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Find out for what purposes your personal data may be used.
                  </p>
                  <DataUsageDialog />
              </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
