import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign Up · CraftMySarees" }] }),
  component: Register,
});

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-soft">
        <h1 className="font-display text-3xl font-bold text-center">Create Account</h1>
        <p className="text-center text-sm text-muted-foreground mt-1">Join the CraftMySarees family</p>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (email) { login(email, name); toast.success("Account created!"); navigate({ to: "/profile" }); } }}>
          <div className="space-y-1.5"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Mobile</Label><Input type="tel" /></div>
          <div className="space-y-1.5"><Label>Password</Label><Input type="password" /></div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Create Account</Button>
        </form>
        <div className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-brand font-semibold">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
