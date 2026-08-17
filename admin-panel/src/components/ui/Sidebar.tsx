"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Users, 
  BarChart2, 
  MessageSquare, 
  History, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ChevronDown,
  Plus
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentAdmin, logout } = useAdminStore();
  const [contentOpen, setContentOpen] = useState(pathname.startsWith("/dashboard/content") || pathname.includes("/categories") || pathname.includes("/tags"));
  const [profilePopover, setProfilePopover] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Content",
      icon: FileText,
      isParent: true,
      open: contentOpen,
      setOpen: setContentOpen,
      subItems: [
        { name: "All Content", href: "/dashboard/content" },
        { name: "Add Content", href: "/dashboard/content/new" },
        { name: "Categories", href: "/dashboard/categories" },
        { name: "Tags", href: "/dashboard/tags" }
      ]
    },
    { name: "Media Library", href: "/dashboard/media", icon: Image },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Activity Log", href: "/dashboard/activity", icon: History }
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 90 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 bottom-0 left-0 z-30 bg-white border-r border-border-custom flex flex-col justify-between py-6 overflow-hidden select-none"
    >
      <div>
        {/* Logo Section */}
        <div className="px-6 flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-9 h-9 text-primary-navy" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5C24.5 5 28 8.5 28 13C28 19 12 21 12 27C12 31.5 15.5 35 20 35C24.5 35 28 31.5 28 27C28 23 25 21 20 21C15 21 12 19 12 13C12 8.5 15.5 5 20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="font-heading text-lg font-bold tracking-tight text-primary-navy leading-none">
                  Dr. Atmik AI
                </span>
                <span className="font-ui text-[10px] uppercase tracking-wider text-accent-gold mt-0.5">
                  Admin Panel
                </span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="px-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {menuItems.map((item) => {
            if (item.isParent) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => !sidebarCollapsed && item.setOpen?.(!item.open)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-sidebar transition-all duration-200 ${
                      pathname.startsWith("/dashboard/content") || pathname.includes("/categories") || pathname.includes("/tags")
                        ? "bg-primary-navy/5 text-primary-navy font-medium"
                        : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon size={20} className="stroke-[1.5]" />
                      {!sidebarCollapsed && <span className="text-sm font-ui">{item.name}</span>}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${item.open ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {item.open && !sidebarCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-9 pr-2 overflow-hidden flex flex-col gap-1 mt-1 border-l border-border-custom/60 ml-[23px]"
                      >
                        {item.subItems?.map((sub) => {
                          const isActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`text-xs font-ui py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                                isActive
                                  ? "text-primary-navy font-semibold bg-primary-navy/[0.03]"
                                  : "text-primary-navy/60 hover:text-primary-navy hover:bg-primary-navy/[0.01]"
                              }`}
                            >
                              <span>{sub.name}</span>
                              {sub.name === "Add Content" && (
                                <Plus size={12} className="text-accent-gold" />
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-sidebar transition-all duration-200 ${
                  isActive
                    ? "bg-primary-navy text-white font-medium shadow-soft"
                    : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
                }`}
              >
                <item.icon size={20} className="stroke-[1.5]" />
                {!sidebarCollapsed && <span className="text-sm font-ui">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Details */}
      <div className="px-4 relative">
        <div 
          onClick={() => setProfilePopover(!profilePopover)}
          className="flex items-center gap-3 p-2.5 rounded-sidebar hover:bg-primary-navy/[0.02] cursor-pointer border border-transparent hover:border-border-custom transition-all"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAdmin?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"}
            alt="Profile Avatar"
            className="w-10 h-10 rounded-full object-cover border border-border-custom"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary-navy truncate font-ui">
                {currentAdmin?.name || "Arjun Dev"}
              </p>
              <p className="text-[10px] text-primary-navy/50 font-ui truncate">
                {currentAdmin?.role || "Super Admin"}
              </p>
            </div>
          )}
        </div>

        {/* Profile Popover / Actions Menu */}
        <AnimatePresence>
          {profilePopover && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-4 right-4 bg-white border border-border-custom p-2 rounded-2xl shadow-premium z-50 flex flex-col gap-1"
            >
              <Link 
                href="/dashboard/settings" 
                onClick={() => setProfilePopover(false)}
                className="flex items-center gap-2.5 text-xs text-primary-navy/80 hover:text-primary-navy hover:bg-primary-navy/[0.02] px-3 py-2 rounded-xl transition-colors font-ui"
              >
                <Settings size={14} />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={() => {
                  setProfilePopover(false);
                  logout();
                }}
                className="flex items-center gap-2.5 text-xs text-danger hover:bg-danger/5 px-3 py-2 rounded-xl transition-colors font-ui text-left"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full border border-border-custom bg-white hover:bg-primary-navy/[0.02] text-primary-navy/70 hover:text-primary-navy shadow-sm transition-all"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
