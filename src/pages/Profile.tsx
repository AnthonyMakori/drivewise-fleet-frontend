import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthState, setAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
});

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authState = getAuthState();
  const [name, setName] = useState(authState.user?.name || "");
  const [email, setEmail] = useState(authState.user?.email || "");
  const [phone, setPhone] = useState(authState.user?.phone || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!authState.isAuthenticated) navigate("/login"); }, [authState, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = profileSchema.parse({ name, email, phone });
      const updatedUser = { ...authState.user, ...validated } as any;
      setAuthState({ ...authState, user: updatedUser });
      window.dispatchEvent(new Event("auth-change"));
      toast({ title: "Profile updated!" });
    } catch (error) {
      if (error instanceof z.ZodError) toast({ variant: "destructive", title: "Validation error", description: error.errors[0].message });
    } finally { setLoading(false); }
  };

  if (!authState.user) return null;
  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings</p>
        
        <div className="max-w-2xl">
          <Card className="glass glow-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputClass} /></div>
                <div className="pt-4"><Button type="submit" disabled={loading} className="glow-sm">{loading ? "Saving..." : "Save Changes"}</Button></div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6 glass">
            <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium capitalize text-primary">{authState.user.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium">{authState.user.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
