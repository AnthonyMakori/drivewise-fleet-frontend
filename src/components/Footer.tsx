import { Link } from "react-router-dom";
import { Car, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <span className="gradient-text">DriveWise</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for premium car rentals. Experience quality, comfort, and convenience.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Browse Cars", "Pricing", "Contact", "About Us"].map(link => (
                <li key={link}>
                  <Link to={link === "Browse Cars" ? "/cars" : "#"} className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {["Help Center", "Terms of Service", "Privacy Policy", "Cancellation Policy"].map(link => (
                <li key={link}>
                  <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DriveWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
