import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/store";
import { toast } from "sonner";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login · CraftMySarees" }] }),
  component: AdminLogin,
});

const DEMO = { email: "admin@craftmysarees.com", password: "admin123" };

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (email === DEMO.email && password === DEMO.password) {
      login(email, "Admin", true);
      toast.success("Welcome, Admin!");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid credentials. Use demo credentials below.");
    }
    setLoading(false);
  };

  const fillDemo = () => { setEmail(DEMO.email); setPassword(DEMO.password); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy/5 via-background to-brand/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy text-navy-foreground mb-4 shadow-soft">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">CraftMySarees Management System</p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-soft">
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@craftmysarees.com" required />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-navy-foreground" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-muted/60 border border-dashed">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Demo Credentials</p>
            <div className="space-y-1 text-sm font-mono">
              <p><span className="text-muted-foreground">Email:</span> admin@craftmysarees.com</p>
              <p><span className="text-muted-foreground">Password:</span> admin123</p>
            </div>
            <button onClick={fillDemo} className="mt-3 text-xs text-brand font-semibold hover:underline">
              Click to autofill →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
