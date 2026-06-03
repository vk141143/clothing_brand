import { Outlet, useRouterState } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import { CinematicIntro } from "@/components/CinematicIntro";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

export function ShopLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isAdmin = path.startsWith("/admin");
  const [showIntro, setShowIntro] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if intro has been shown in this session
    const introShown = sessionStorage.getItem("introShown");
    if (introShown) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("introShown", "true");
  };

  if (isAdmin) return <Outlet />;

  // Don't render intro until client is mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <MobileBottomNav />
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {showIntro && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>
          <Footer />
          <MobileBottomNav />
          <Toaster position="top-center" richColors />
        </>
      )}
    </div>
  );
}
