
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
import { cn } from "@/lib/utils";

const PurposeItem = ({
  purpose,
  dataType,
  basis,
}: {
  purpose: string;
  dataType: string;
  basis: string;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-background/50">
    <div>
      <h5 className="font-semibold text-foreground">Purpose/Activity</h5>
      <p>{purpose}</p>
    </div>
    <div>
      <h5 className="font-semibold text-foreground">Type of data</h5>
      <p className="whitespace-pre-wrap">{dataType}</p>
    </div>
    <div>
      <h5 className="font-semibold text-foreground">Lawful basis for processing</h5>
      <p className="whitespace-pre-wrap">{basis}</p>
    </div>
  </div>
);

export function DataUsageDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-auto">
          Read Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary font-headline">
            Data Usage Policy
          </DialogTitle>
          <DialogDescription>
            How and why we use your personal data.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-4 -mx-4 border-y">
          <div className="space-y-6 text-sm text-muted-foreground pr-6">
            <p>
              We have set out below a description of all the ways we plan to use
              your personal data, and which of the legal bases we rely on to do
              so. We have also identified what our legitimate interests are where
              appropriate.
            </p>
            <p>
              Note that we may process your personal data for more than one
              lawful ground depending on the specific purpose for which we are
              using your data. Please contact us if you need details about the
              specific legal ground we are relying on to process your personal
              data where more than one ground has been set out below.
            </p>
            
            <div className="space-y-4">
              <PurposeItem
                purpose="To register you as a new customer"
                dataType="(a) Identity\n(b) Contact"
                basis="Performance of a contract with you"
              />
              <PurposeItem
                purpose="To process and deliver your order including: (a) Manage payments, fees and charges, (b) Collect and recover money owed to us"
                dataType="(a) Identity\n(b) Contact\n(c) Financial\n(d) Transaction\n(e) Marketing and Communications"
                basis="(a) Performance of a contract with you\n(b) Necessary for our legitimate interests (to recover debts due to us)"
              />
              <PurposeItem
                purpose="To manage our relationship with you which will include: (a) Notifying you about changes to our terms or privacy policy, (b) Asking you to leave a review or take a survey"
                dataType="(a) Identity\n(b) Contact\n(c) Profile\n(d) Marketing and Communications"
                basis="(a) Performance of a contract with you\n(b) Necessary to comply with a legal obligation\n(c) Necessary for our legitimate interests (to keep our records updated and to study how customers use our products/services)"
              />
               <PurposeItem
                purpose="To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data)"
                dataType="(a) Identity\n(b) Contact\n(c) Technical"
                basis="(a) Necessary for our legitimate interests (for running our business, provision of administration and IT services, network security, to prevent fraud and in the context of a business reorganisation or group restructuring exercise)\n(b) Necessary to comply with a legal obligation"
              />
               <PurposeItem
                purpose="To gather and provide information required by or relating to audits, enquiries or investigations by regulatory bodies or law enforcement authorities"
                dataType="(a) Identity\n(b) Technical\n(c) Profile"
                basis="(a) Necessary for our legitimate interests in preventing fraud\n(b) Necessary for the performance of a task carried out in the public interest\n(c) Necessary to comply with a legal obligation"
              />
               <PurposeItem
                purpose="To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you"
                dataType="(a) Identity\n(b) Contact\n(c) Profile\n(d) Usage\n(e) Marketing and Communications\n(f) Technical"
                basis="Necessary for our legitimate interests (to study how customers use our products/services, to develop them, to grow our business and to inform our marketing strategy)"
              />
                <PurposeItem
                purpose="To use data analytics to improve our website, products/services, marketing, customer relationships and experiences"
                dataType="(a) Technical\n(b) Usage"
                basis="Necessary for our legitimate interests (to define types of customers for our products and services, to keep our website updated and relevant, to develop our business and to inform our marketing strategy)"
              />
               <PurposeItem
                purpose="To make suggestions and recommendations to you about goods or services that may be of interest to you"
                dataType="(a) Identity\n(b) Contact\n(c) Technical\n(d) Usage\n(e) Profile"
                basis="Necessary for our legitimate interests (to develop our products/services and grow our business)"
              />
            </div>

            <h3 className="font-bold text-lg text-foreground pt-4">MARKETING</h3>
            <p>We strive to provide you with choices regarding certain personal data uses, particularly around marketing and advertising. We have established a preference centre within your account where you can view and make certain decisions about your personal data use.</p>
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
