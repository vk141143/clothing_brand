import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · CraftMySarees" }] }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    toast.success("Welcome back!");
    navigate({ to: "/profile" });
  };
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-soft">
        <h1 className="font-display text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">Sign in to continue shopping</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5"><Label>Email or Mobile</Label><Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div className="space-y-1.5"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
          <Link to="/forgot-password" className="text-xs text-brand hover:underline block text-right">Forgot password?</Link>
          <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Sign In</Button>
        </form>
        <div className="text-center text-sm mt-4">
          New here? <Link to="/register" className="text-brand font-semibold">Create account</Link>
        </div>
      </div>
    </div>
  );
}
