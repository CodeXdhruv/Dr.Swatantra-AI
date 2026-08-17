"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ToggleLeft, 
  ToggleRight, 
  Mail, 
  Briefcase, 
  Lock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { User } from "@/services/mockData";

export default function UsersPage() {
  const { users, toggleUserStatus, updateUserRole, inviteUser } = useAdminStore();
  
  // Invite Form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<User['role']>("Editor");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    if (users.some(u => u.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error("User with this email is already registered.");
      return;
    }

    inviteUser(inviteName, inviteEmail, inviteRole);
    setInviteName("");
    setInviteEmail("");
    toast.success(`Invitation sent to ${inviteName} (${inviteEmail})!`);
  };

  const handleStatusToggle = (id: string, name: string) => {
    toggleUserStatus(id);
    const user = users.find(u => u.id === id);
    // Zustand toggled status so the state reflects the opposite of current
    const nextStatus = user?.status === "Active" ? "Inactive" : "Active";
    toast.success(`User "${name}" has been set to ${nextStatus}`);
  };

  const handleRoleChange = (id: string, role: User['role']) => {
    updateUserRole(id, role);
    toast.success(`Role updated to ${role}`);
  };

  return (
    <div className="space-y-6 select-none font-ui relative">
      <Toaster position="top-right" />

      {/* Header Row */}
      <div>
        <h2 className="font-heading text-3xl font-bold text-primary-navy">Users & Permissions</h2>
        <p className="text-xs text-primary-navy/40 mt-1 font-light">Manage administrator accounts, assign access scopes, and audit profiles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Users List Table - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-border-custom rounded-card shadow-soft overflow-hidden">
            <div className="p-5 border-b border-border-custom/50">
              <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
                Administrators Directory
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-custom bg-background/30 text-[10px] uppercase tracking-wider font-semibold text-primary-navy/40">
                    <th className="py-4 px-6 font-medium">User Profile</th>
                    <th className="py-4 px-4 font-medium">Role</th>
                    <th className="py-4 px-4 font-medium">Permissions Scope</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-4 font-medium">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom/50 text-xs">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-primary-navy/[0.005]">
                      {/* Profile Column */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-border-custom flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-primary-navy truncate">{user.name}</p>
                          <p className="text-[10px] text-primary-navy/40 mt-0.5 truncate">{user.email}</p>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                          className="bg-transparent border border-border-custom rounded-lg px-2.5 py-1 text-xs text-primary-navy cursor-pointer focus:border-accent-gold/40 outline-none"
                          disabled={user.name === "Arjun Dev"} // Super protect first admin
                        >
                          <option>Super Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                      </td>

                      {/* Permissions List */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.permissions.map((perm) => (
                            <span 
                              key={perm}
                              className="px-1.5 py-0.5 bg-primary-navy/5 border border-border-custom rounded text-[8px] font-mono text-primary-navy/60 uppercase"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusToggle(user.id, user.name)}
                          className="p-1 rounded text-primary-navy/50 hover:text-primary-navy cursor-pointer transition-colors"
                          disabled={user.name === "Arjun Dev"}
                        >
                          {user.status === "Active" ? (
                            <div className="flex items-center gap-1.5 text-success font-semibold">
                              <ToggleRight size={22} className="stroke-[1.5]" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-primary-navy/35">
                              <ToggleLeft size={22} className="stroke-[1.5]" />
                              <span>Inactive</span>
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Last Login */}
                      <td className="py-4 px-4 text-primary-navy/40">{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination mock */}
            <div className="border-t border-border-custom bg-background/20 px-6 py-4 flex items-center justify-between text-[11px] text-primary-navy/40">
              <span>Showing 1 to {users.length} of {users.length} administrators</span>
              
              <div className="flex items-center gap-1.5">
                <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50 disabled:opacity-50">
                  <ChevronLeft size={13} />
                </button>
                <button className="w-5 h-5 flex items-center justify-center rounded bg-primary-navy text-white font-semibold">
                  1
                </button>
                <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50 disabled:opacity-50">
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Invite User Form */}
        <div className="space-y-6">
          <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border-custom/50 pb-2">
              <UserPlus size={16} className="text-accent-gold" />
              <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
                Invite Administrator
              </h3>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 pt-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-navy/30">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="priya@atmik.ai"
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Default Role */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase size={12} /> Assign Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as User['role'])}
                  className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy outline-none cursor-pointer"
                >
                  <option>Editor</option>
                  <option>Viewer</option>
                  <option>Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-navy hover:bg-primary-navy/90 text-white rounded-button text-xs font-semibold shadow-soft hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              >
                <UserPlus size={14} />
                <span>Send Invite Email</span>
              </button>
            </form>
          </div>

          {/* Security & Access scopes audit */}
          <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-3 font-ui text-[11px] text-primary-navy/60">
            <div className="flex items-center gap-2 text-primary-navy border-b border-border-custom/50 pb-2">
              <Lock size={14} className="text-accent-gold" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">Access Scope Reference</h3>
            </div>
            <div className="space-y-2 pt-1 font-light">
              <p><span className="font-semibold text-primary-navy">Super Admin:</span> Full workspace access, API config keys, and billing control.</p>
              <p><span className="font-semibold text-primary-navy">Editor:</span> Edit/create books, articles, categories, and direct R2 file uploads.</p>
              <p><span className="font-semibold text-primary-navy">Viewer:</span> Read-only access to dashboard statistics, content items, and activity timelines.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
