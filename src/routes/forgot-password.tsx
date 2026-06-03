import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md p-8 border rounded-2xl bg-card shadow-soft">
        <h1 className="font-display text-2xl font-bold text-center">Reset Password</h1>
        {!sent ? (
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="space-y-1.5"><Label>Registered Email / Mobile</Label><Input required /></div>
            <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Send OTP</Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4">
            <p className="text-sm text-center text-muted-foreground">Enter the 6-digit OTP sent to your email</p>
            <div className="flex gap-2 justify-center">{Array.from({ length: 6 }).map((_, i) => <Input key={i} maxLength={1} className="w-10 h-12 text-center font-bold" />)}</div>
            <Button type="button" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Verify & Continue</Button>
          </form>
        )}
        <div className="text-center text-sm mt-4"><Link to="/login" className="text-brand">Back to login</Link></div>
      </div>
    </div>
  );
}
