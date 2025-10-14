
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs text-muted-foreground/50">
          Terms & Conditions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary font-headline">
            Tebex Terms & Conditions
          </DialogTitle>
          <DialogDescription>
            Last updated on 12th June 2023.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              This page, together with our Privacy Policy and General Website
              Terms & Conditions, tells you information about us and informs you
              of the legal terms and conditions (the “Terms”) which govern your
              use of our ("Seller", "We", "Us", "Our") webstore (the
              "Webstore").
            </p>
            <p>
              These Terms will apply to any contract between you and the Us in
              respect of your purchase of video game related products, items and
              other content (“Products”) on the Webstore (“ Contract”).
            </p>
            <p>
              Please read these Terms carefully and make sure that you
              understand them before ordering from the Webstore. Please note
              that before placing an order you will be asked to agree to these
              Terms. If you refuse to accept these Terms, you will not be able
              to place an order.
            </p>
            <p>
              You should print a copy of these Terms off or save them to your
              computer for future reference.
            </p>
            <p>
              We amend these Terms from time to time, as set out in Condition
              11. Every time you wish to place an order, please check these
              Terms to ensure that you understand the terms which will apply at
              that time. These Terms were most recently updated on 12th June
              2023.
            </p>
            <p>
              These Terms are only available in the English language.
            </p>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
