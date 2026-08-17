"use client";

import { useAdminStore } from "@/store/adminStore";
import { Search, Bell, HelpCircle, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export default function Topbar() {
  const { 
    setCommandPaletteOpen, 
    setNotificationCenterOpen, 
    notifications,
    currentAdmin 
  } = useAdminStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Listen to ⌘K keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCommandPaletteOpen]);

  return (
    <header className="sticky top-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-border-custom h-[72px] flex items-center justify-between px-8">
      {/* Search Input Trigger */}
      <div 
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-3.5 bg-background border border-border-custom hover:border-accent-gold/40 px-4 py-2 rounded-input w-80 cursor-pointer select-none transition-all group"
      >
        <Search size={16} className="text-primary-navy/40 group-hover:text-accent-gold transition-colors" />
        <span className="text-xs text-primary-navy/40 flex-1 font-ui">Search content, users, tags...</span>
        <kbd className="text-[10px] text-primary-navy/30 bg-white border border-border-custom px-1.5 py-0.5 rounded font-mono select-none">
          ⌘K
        </kbd>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          onClick={() => setNotificationCenterOpen(true)}
          className="relative p-2.5 rounded-full hover:bg-primary-navy/[0.03] text-primary-navy/70 hover:text-primary-navy transition-colors cursor-pointer group"
        >
          <Bell size={18} className="stroke-[1.5] group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Help Circle */}
        <button
          className="p-2.5 rounded-full hover:bg-primary-navy/[0.03] text-primary-navy/70 hover:text-primary-navy transition-colors cursor-pointer"
          title="Documentation & Help"
        >
          <HelpCircle size={18} className="stroke-[1.5]" />
        </button>

        {/* Preview App Button */}
        <LinkButton />

        {/* User Mini Profile Avatar */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAdmin?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"}
            alt="Admin Avatar"
            className="w-9 h-9 rounded-full object-cover border border-border-custom"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  );
}

// Mini inner component to bypass standard Link tag warning if used without next-link or to render mock app view preview
function LinkButton() {
  return (
    <a
      href="https://atmik.ai"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-4 py-2 border border-border-custom bg-white text-primary-navy hover:bg-primary-navy hover:text-white rounded-button text-xs font-semibold font-ui cursor-pointer shadow-soft transition-all duration-200"
    >
      <span>Preview App</span>
      <ExternalLink size={13} />
    </a>
  );
}
