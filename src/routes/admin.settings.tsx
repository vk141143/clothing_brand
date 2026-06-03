import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/lib/store";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { theme, set } = useTheme();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Settings</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-card border rounded-xl space-y-3">
          <h2 className="font-semibold">Website Settings</h2>
          <div className="space-y-1.5"><Label className="text-xs">Site Title</Label><Input defaultValue="CraftMySarees" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Support Email</Label><Input defaultValue="hello@craftmysarees.com" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Support Phone</Label><Input defaultValue="+91 98765 43210" /></div>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground">Save</Button>
        </div>
        <div className="p-6 bg-card border rounded-xl space-y-3">
          <h2 className="font-semibold">Theme</h2>
          <div className="flex gap-3">
            <button onClick={() => set("light")} className={`flex-1 p-4 border rounded-lg ${theme === "light" ? "border-brand bg-brand/5" : ""}`}>☀️ Light</button>
            <button onClick={() => set("dark")} className={`flex-1 p-4 border rounded-lg ${theme === "dark" ? "border-brand bg-brand/5" : ""}`}>🌙 Dark</button>
          </div>
        </div>
        <div className="p-6 bg-card border rounded-xl space-y-3">
          <h2 className="font-semibold">Banner Management</h2>
          <Input type="file" />
          <Input placeholder="Banner title" />
          <Button variant="outline">+ Add Banner</Button>
        </div>
        <div className="p-6 bg-card border rounded-xl space-y-3">
          <h2 className="font-semibold">Category Management</h2>
          <Input placeholder="New category name" />
          <Button variant="outline">+ Add Category</Button>
        </div>
      </div>
    </div>
  );
}
