"use client";

import { useAdminStore } from "@/store/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Info, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export default function NotificationCenter() {
  const { 
    notificationCenterOpen, 
    setNotificationCenterOpen, 
    notifications, 
    markAllNotificationsRead 
  } = useAdminStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setNotificationCenterOpen(false);
      }
    };
    if (notificationCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationCenterOpen, setNotificationCenterOpen]);

  const getIcon = (title: string) => {
    const text = title.toLowerCase();
    if (text.includes("upload") || text.includes("media")) return <FileText size={15} className="text-accent-gold" />;
    if (text.includes("publish")) return <CheckCircle size={15} className="text-success" />;
    if (text.includes("delete")) return <AlertTriangle size={15} className="text-danger" />;
    return <Info size={15} className="text-primary-navy/50" />;
  };

  return (
    <AnimatePresence>
      {notificationCenterOpen && (
        <div className="fixed inset-0 z-40 bg-primary-navy/20 backdrop-blur-xs flex justify-end">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            ref={drawerRef}
            className="w-[360px] bg-white h-full shadow-premium border-l border-border-custom flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-primary-navy">Notifications</h3>
                <p className="text-[10px] text-primary-navy/40 font-ui mt-0.5">Admin action and system events</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllNotificationsRead}
                  className="p-2 rounded-full hover:bg-primary-navy/5 text-primary-navy/60 hover:text-accent-gold transition-colors"
                  title="Mark all as read"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setNotificationCenterOpen(false)}
                  className="p-2 rounded-full hover:bg-primary-navy/5 text-primary-navy/60 hover:text-primary-navy transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      notif.read 
                        ? "bg-white border-border-custom/55" 
                        : "bg-primary-navy/[0.01] border-accent-gold/20 shadow-sm"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-background flex items-center justify-center border border-border-custom">
                        {getIcon(notif.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold ${notif.read ? "text-primary-navy/80" : "text-primary-navy"} font-ui`}>
                            {notif.title}
                          </p>
                          <span className="text-[9px] text-primary-navy/40 font-ui">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-primary-navy/60 font-ui mt-1 leading-relaxed">
                          {notif.desc}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0 self-center" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-xs text-primary-navy/30 font-ui">No notifications yet.</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border-custom bg-background flex justify-center">
              <button
                onClick={() => setNotificationCenterOpen(false)}
                className="text-xs font-semibold text-primary-navy hover:text-accent-gold transition-colors font-ui"
              >
                Close Notification Panel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
