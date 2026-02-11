import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Get In Touch</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">We'd love to hear from you</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              {[
                { icon: Phone, title: "Phone", value: "+1 (555) 123-4567" },
                { icon: Mail, title: "Email", value: "info@drivewise.com" },
                { icon: MapPin, title: "Address", value: "123 Auto Street, Car City, CC 12345" },
              ].map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-start gap-4 glass rounded-xl p-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-muted-foreground text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                placeholder="Your Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 focus:border-primary/50"
              />
              <Input 
                type="email" 
                placeholder="Your Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 focus:border-primary/50"
              />
              <Textarea 
                placeholder="Your Message" 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 focus:border-primary/50"
              />
              <Button type="submit" className="w-full glow-sm">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
