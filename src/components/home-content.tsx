import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeContent() {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">Welcome to the official Cloudverse Store</h2>
            <p className="text-lg text-muted-foreground">
              Cloudverse is a free-to-play Public Minecraft Server. Items can be purchased here to enhance gameplay and grant the player various special perks.
            </p>
          </div>
          <Card className="transform hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Refund Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All payments are final and non-refundable. Attempting a chargeback or opening a PayPal dispute will result in permanent and irreversible banishment from all of our servers, and other Minecraft stores.
              </p>
              <p className="text-sm text-muted-foreground">
                Payments are taken and secured by Tebex, a world leader in online gaming transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
