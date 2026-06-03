import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-20">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-bold mb-3">CraftMySarees</div>
          <p className="text-sm opacity-80 leading-relaxed">
            Curating India's finest handwoven sarees since 2010. Authentic craftsmanship delivered worldwide.
          </p>
          <div className="flex gap-3 mt-4">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand hover:border-brand transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/category/$slug" params={{ slug: "silk" }}>Silk Sarees</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "banarasi" }}>Banarasi</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "kanjivaram" }}>Kanjivaram</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "bridal" }}>Bridal</Link></li>
            <li><Link to="/shop">All Sarees</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/support">Help & FAQ</Link></li>
            <li><Link to="/orders">Track Order</Link></li>
            <li><a href="#">Returns & Exchange</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Newsletter</h4>
          <p className="text-sm opacity-80 mb-3">Get 10% off your first order & weekly drops.</p>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input type="email" placeholder="Your email" className="pl-9 bg-white/10 border-white/20 text-navy-foreground placeholder:text-white/60" />
            </div>
            <Button type="button" className="bg-brand hover:bg-brand/90 text-brand-foreground">Join</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} CraftMySarees. All rights reserved. · Made with love in India.
      </div>
    </footer>
  );
}
