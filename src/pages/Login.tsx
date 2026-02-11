import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = loginSchema.parse(credentials);
      const user = await login(validated.email, validated.password);
      toast({ title: "Login successful!", description: `Welcome back, ${user.name}` });
      window.dispatchEvent(new Event("auth-change"));
      navigate(user.role === "admin" ? "/admin" : "/cars");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: "Validation Error", description: error.errors[0].message });
      } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Glow effects */}
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
            <CardTitle className="text-2xl gradient-text">Welcome Back</CardTitle>
            <CardDescription>Login to continue your journey</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="e.g johndoe@gmail.com"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="bg-secondary/50 border-border/50 focus:border-primary/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-primary text-sm hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full glow-sm">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <div className="text-sm text-center text-muted-foreground w-full">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create Account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
