
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

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs text-muted-foreground/50">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary font-headline">
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Last updated on 11 May 2018.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="font-bold text-lg text-foreground">1. IMPORTANT INFORMATION AND WHO WE ARE</h3>
            <h4 className="font-semibold text-md text-foreground">PURPOSE OF THIS PRIVACY NOTICE</h4>
            <p>This privacy notice aims to give you information on how Tebex Limited collect and process your personal data through your use of www.tebex.io and www.buycraft.net (together referred to as “this website”), and also any associated webstore (a “Webstore”) which utilities the Tebex webstore platform for game servers (the “Tebex Platform”), including any data you may provide through this website when you purchase a product or service.</p>
            <p>This website is not intended for children and we do not knowingly collect data relating to children. We realise and understand that children and young people may visit this website, or otherwise interact with us and our commercial partners. It is our policy to encourage all minors to consult with their parents or legal guardian before submitting any content or information to us, our commercial partners or other third parties.</p>
            <p>It is important that you read this privacy notice together with any other privacy notice or fair processing notice we may provide on specific occasions when we are collecting or processing personal data about you so that you are fully aware of how and why we are using your data. This privacy notice supplements the other notices and is not intended to override them.</p>

            <h4 className="font-semibold text-md text-foreground">CONTROLLER</h4>
            <p>Tebex Limited is the controller and responsible for your personal data (collectively referred to as “Tebex”, “we”, “us” or “our” in this privacy notice).</p>
            <p>We have appointed a data privacy manager who is responsible for overseeing questions in relation to this privacy notice. If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact the data privacy manager using the details set out below.</p>

            <h4 className="font-semibold text-md text-foreground">CONTACT DETAILS</h4>
            <p>Full name of legal entity: Tebex Limited, company number 08129184 of Levy Cohen &amp; Co, 5.2 Central House, 1 Ballards Lane, London, United Kingdom, N3 1LQ.</p>
            <p>Name or title of data privacy manager: Liam Wiltshire</p>
            <p>Email address: liam.wiltshire@overwolf.com</p>
            <p>You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues (www.ico.org.uk). We would, however, appreciate the chance to deal with your concerns before you approach the ICO so please contact us in the first instance.</p>
            
            <h4 className="font-semibold text-md text-foreground">CHANGES TO THE PRIVACY NOTICE AND YOUR DUTY TO INFORM US OF CHANGES</h4>
            <p>This version was last updated on 11 May 2018 and historic versions can be obtained by contacting us.</p>
            <p>It is important that the personal data we hold about you is accurate and current. Please keep us informed if your personal data changes during your relationship with us.</p>
            
            <h4 className="font-semibold text-md text-foreground">THIRD-PARTY LINKS</h4>
            <p>This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy notice of every website you visit.</p>

            <h3 className="font-bold text-lg text-foreground mt-6">2. THE DATA WE COLLECT ABOUT YOU</h3>
            <p>Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).</p>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
            <ul className="list-disc list-inside space-y-1">
                <li>Identity Data includes first name, last name, and username or similar identifier.</li>
                <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                <li>Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                <li>Profile Data includes your username and password, purchases or orders made by you, and any account preferences.</li>
                <li>Usage Data includes information about how you use our website, products and services.</li>
                <li>Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
            </ul>
            <p>We also collect, use and share Aggregated Data such as statistical or demographic data for any purpose. Aggregated Data may be derived from your personal data but is not considered personal data in law as this data does not directly or indirectly reveal your identity. For example, we may aggregate your Usage Data to calculate the percentage of users accessing a specific website feature. However, if we combine or connect Aggregated Data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this privacy notice.</p>
            <p>We do not collect any Special Categories of Personal Data about you (this includes details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health and genetic and biometric data). Nor do we collect any information about criminal convictions and offences.</p>

            <h4 className="font-semibold text-md text-foreground">IF YOU FAIL TO PROVIDE PERSONAL DATA</h4>
            <p>Where we need to collect personal data by law, or under the terms of a contract we have with you and you fail to provide that data when requested, we may not be able to perform the contract we have or are trying to enter into with you (for example, to provide you with goods or services). In this case, we may have to cancel a product or service you have with us but we will notify you if this is the case at the time.</p>
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
