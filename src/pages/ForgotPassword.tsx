import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Car, ArrowLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      emailSchema.parse({ email });
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: "Validation error", description: error.errors[0].message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center relative z-10">
        <Card className="w-full max-w-md glass glow-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Car className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl gradient-text">Forgot Password?</CardTitle>
            <CardDescription>
              {sent ? "We've sent you a password reset link" : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary/50 border-border/50 focus:border-primary/50" />
                </div>
                <Button type="submit" className="w-full glow-sm" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to Login</Link>
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  We've sent a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox.
                </p>
                <Button className="w-full glow-sm" asChild>
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
