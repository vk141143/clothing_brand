import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, FileText, Phone } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Help & Support · CraftMySarees" }] }),
  component: Support,
});

function Support() {
  const faqs = [
    { q: "How do I track my order?", a: "Visit My Orders → click on the order to view live tracking and delivery status." },
    { q: "What is your return policy?", a: "We offer 7-day easy returns on most products. Bridal & customised sarees are not returnable." },
    { q: "How long does delivery take?", a: "Standard delivery takes 4–7 business days. Express delivery is available in 1–2 days." },
    { q: "Are your sarees authentic?", a: "Yes, 100%. All our sarees come with a certificate of authenticity from our master weavers." },
    { q: "Do you ship internationally?", a: "Yes, we ship to 50+ countries. International shipping rates apply at checkout." },
  ];
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-bold">How can we help?</h1>
        <p className="text-muted-foreground mt-2">Our team is here for you 24/7</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
        {[
          { icon: MessageCircle, t: "Live Chat", d: "Chat with our team" },
          { icon: Phone, t: "Call Us", d: "+91 98765 43210" },
          { icon: FileText, t: "Raise a Ticket", d: "Get email support" },
        ].map((s) => (
          <div key={s.t} className="p-6 border rounded-xl bg-card text-center hover:shadow-soft transition cursor-pointer">
            <s.icon className="h-8 w-8 text-brand mx-auto" />
            <h3 className="font-semibold mt-3">{s.t}</h3>
            <p className="text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
        <div>
          <h2 className="font-display text-2xl font-bold mb-4">Frequently Asked</h2>
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold mb-4">Raise a Ticket</h2>
          <form className="space-y-3 p-6 border rounded-xl bg-card">
            <div className="space-y-1.5"><Label>Name</Label><Input /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input type="email" /></div>
            <div className="space-y-1.5"><Label>Order ID (optional)</Label><Input /></div>
            <div className="space-y-1.5"><Label>Message</Label><Textarea rows={5} /></div>
            <Button type="button" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Submit Ticket</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
