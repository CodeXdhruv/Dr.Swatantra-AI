"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import CommandPalette from "@/components/ui/CommandPalette";
import NotificationCenter from "@/components/ui/NotificationCenter";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { sidebarCollapsed } = useAdminStore();
  const [mounted, setMounted] = useState(false);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!useAdminStore.getState().currentAdmin) {
          try {
            const token = await user.getIdToken();
            const res = await fetch('https://atmik-ai-backend.swatantra-backend.workers.dev/api/auth/sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                firebaseUid: user.uid,
                email: user.email,
              })
            });
            const data = await res.json();
            if (data.role === 'ADMIN') {
              useAdminStore.getState().login({ 
                id: data.id, 
                name: user.email?.split('@')[0] || "Admin", 
                email: user.email || "", 
                role: data.role as 'ADMIN' | 'USER'
              });
            } else {
              router.push("/");
              return;
            }
          } catch (e) {
            console.error("Failed to hydrate user session", e);
          }
        }
        setIsFirebaseAuthenticated(true);
      } else {
        setIsFirebaseAuthenticated(false);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!mounted || isFirebaseAuthenticated === null || !isFirebaseAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-accent-gold mb-3" size={24} />
        <span className="text-xs text-primary-navy/40 font-ui font-light">Loading workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex text-primary-navy select-none">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div 
        className="flex-1 min-h-screen flex flex-col transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? "90px" : "280px" }}
      >
        {/* Sticky Topbar */}
        <Topbar />

        {/* Scrollable Content Frame */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <NotificationCenter />
    </div>
  );
}
