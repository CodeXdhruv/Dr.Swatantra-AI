"use client";

import { useAdminStore } from "@/store/adminStore";
import { Search, Bell, Sun, UserCircle, ChevronDown, LogOut, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { 
    setCommandPaletteOpen, 
    setNotificationCenterOpen, 
    notifications,
    currentAdmin,
    setMobileMenuOpen
  } = useAdminStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      useAdminStore.getState().logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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
    <header className="sticky top-0 right-0 z-20 bg-[#FAFBFC] border-b border-border-custom h-[80px] flex items-center justify-between px-4 lg:px-8 gap-4">
      <div className="flex items-center gap-3 lg:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -ml-2 text-primary-navy/70 hover:text-primary-navy"
        >
          <Menu size={24} />
        </button>

        {/* Search Input Trigger */}
        <div 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-3 bg-white border border-border-custom hover:border-accent-gold/40 px-3 lg:px-4 py-2.5 rounded-[16px] flex-1 lg:flex-none lg:w-[400px] cursor-pointer select-none transition-all shadow-sm group"
        >
          <Search size={16} className="text-primary-navy/40 group-hover:text-accent-gold transition-colors" />
          <span className="text-xs text-primary-navy/40 flex-1 font-ui hidden sm:block">Search content, users, or tags...</span>
          <span className="text-xs text-primary-navy/40 flex-1 font-ui sm:hidden">Search...</span>
          <kbd className="hidden lg:block text-[10px] text-primary-navy/30 bg-[#FAFBFC] px-1.5 py-0.5 rounded font-mono select-none font-bold">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
        {/* Light/Dark Toggle (Placeholder) */}
        <button
          className="hidden sm:block relative p-2 text-primary-navy/70 hover:text-primary-navy transition-colors cursor-pointer"
        >
          <Sun size={20} className="stroke-[1.5]" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationCenterOpen(true)}
          className="relative p-2 text-primary-navy/70 hover:text-primary-navy transition-colors cursor-pointer group"
        >
          <Bell size={20} className="stroke-[1.5] group-hover:rotate-12 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-danger rounded-full" />
          )}
        </button>

        <div className="w-[1px] h-8 bg-border-custom" />

        {/* User Mini Profile Avatar */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-navy text-white flex-shrink-0 font-bold text-sm overflow-hidden">
              {currentAdmin?.avatar ? (
                <img src={currentAdmin.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                currentAdmin?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] font-bold text-primary-navy leading-none mb-1 font-ui">
                {currentAdmin?.name || "Admin"}
              </span>
              <span className="text-[11px] text-primary-navy/50 leading-none font-ui capitalize">
                {currentAdmin?.role?.toLowerCase() || "admin"}
              </span>
            </div>
            <ChevronDown size={14} className="text-primary-navy/40 ml-1 group-hover:text-primary-navy transition-colors" />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-border-custom rounded-xl shadow-lg py-1 z-50">
              {currentAdmin?.email && (
                <div className="px-4 py-2 border-b border-border-custom">
                  <p className="text-xs text-primary-navy/70 font-ui truncate">{currentAdmin.email}</p>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/5 flex items-center gap-2 transition-colors font-ui"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
