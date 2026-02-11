import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { register } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";
import { z } from "zod";
import axios from "axios";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100),
    email: z.string().trim().email({ message: "Invalid email address" }).max(255),
    phone: z.string().trim().min(10, { message: "Phone number must be at least 10 characters" }).max(20),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = registerSchema.parse({ name, email, phone, password, confirmPassword });
      await register(validated.name, validated.email, validated.phone, validated.password, validated.confirmPassword);
      toast({ title: "Account created!", description: "Welcome to DriveWise!" });
      window.dispatchEvent(new Event("auth-change"));
      navigate("/cars");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: "Validation Error", description: error.errors[0].message });
      } else if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || error.response?.data?.errors?.email?.[0] || "Registration failed.";
        toast({ variant: "destructive", title: "Registration Error", description: msg });
      } else {
        toast({ variant: "destructive", title: "Unexpected Error", description: "Something went wrong." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-secondary/50 border-border/50 focus:border-primary/50";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 py-16 flex items-center justify-center relative z-10">
        <Card className="w-full max-w-md glass glow-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10 animate-pulse-glow">
                <Car className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl gradient-text">Create Account</CardTitle>
            <CardDescription>Join DriveWise today</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} required className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required className={inputClass} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required className={inputClass} />
              </div>
              <Button type="submit" className="w-full glow-sm" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <div className="text-sm text-center text-muted-foreground w-full">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
