"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  Globe, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ContentListPage() {
  const { contentList, deleteContentItem, updateContentItem } = useAdminStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [langFilter, setLangFilter] = useState("All Languages");
  
  // Row action menu dropdown tracking
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter content
  const filteredContent = contentList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
                          item.author.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;
    const matchesLang = langFilter === "All Languages" || item.language === langFilter;

    return matchesSearch && matchesType && matchesStatus && matchesLang;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      deleteContentItem(id);
      setActiveMenuId(null);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    updateContentItem(id, { status: newStatus as any });
    setActiveMenuId(null);
  };

  // Helper views formatting
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* Top action header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-primary-navy">All Content</h2>
          <p className="text-xs text-primary-navy/40 mt-1 font-ui font-light">Manage and organize all your platform content.</p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="flex items-center gap-2 px-5 py-3 bg-primary-navy hover:bg-primary-navy/90 text-white rounded-button text-xs font-semibold font-ui shadow-soft hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <Plus size={14} />
          <span>Add Content</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-border-custom rounded-2xl p-4 shadow-soft flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-navy/30">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors font-ui"
          />
        </div>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-border-custom bg-white px-3.5 py-2 text-xs rounded-input text-primary-navy/70 focus:text-primary-navy outline-none font-ui cursor-pointer min-w-[120px]"
        >
          <option>All Types</option>
          <option>Book</option>
          <option>Article</option>
          <option>Audio</option>
          <option>Video</option>
          <option>Meditation</option>
          <option>Quote</option>
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border-custom bg-white px-3.5 py-2 text-xs rounded-input text-primary-navy/70 focus:text-primary-navy outline-none font-ui cursor-pointer min-w-[120px]"
        >
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>

        {/* Language */}
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="border border-border-custom bg-white px-3.5 py-2 text-xs rounded-input text-primary-navy/70 focus:text-primary-navy outline-none font-ui cursor-pointer min-w-[130px]"
        >
          <option>All Languages</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Spanish</option>
        </select>

        {/* Filter Trigger button */}
        <button
          className="flex items-center gap-2 px-4 py-2 border border-border-custom bg-white text-primary-navy/70 hover:text-primary-navy hover:border-accent-gold/40 rounded-input text-xs font-semibold font-ui cursor-pointer transition-all"
        >
          <Filter size={14} />
          <span>Filter</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-border-custom rounded-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full border-collapse text-left font-ui">
            <thead>
              <tr className="border-b border-border-custom bg-background/30 text-[10px] uppercase tracking-wider font-semibold text-primary-navy/40">
                <th className="py-4 px-6 font-medium">Content</th>
                <th className="py-4 px-4 font-medium">Type</th>
                <th className="py-4 px-4 font-medium">Author</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Views</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/50 text-xs">
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-primary-navy/[0.005] group transition-colors">
                    {/* Content Column */}
                    <td className="py-3 px-6 flex items-center gap-4">
                      {/* Cover Thumbnail 4:5 ratio wrapper */}
                      <div className="w-10 h-13 border border-border-custom bg-primary-navy/[0.02] rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {item.thumbnail.startsWith("/mock") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              item.title === "The Science of Soul" ? "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=80&h=100&q=80" :
                              item.title === "Atmik Intelligence" ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&h=100&q=80" :
                              item.title === "Meditation for Beginners" ? "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=80&h=100&q=80" :
                              "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=80&h=100&q=80"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen size={16} className="text-primary-navy/30" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-primary-navy truncate">{item.title}</p>
                        <p className="text-[10px] text-primary-navy/40 mt-0.5 truncate leading-relaxed">{item.subtitle}</p>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 text-primary-navy/70">{item.type}</td>

                    {/* Author */}
                    <td className="py-3 px-4 text-primary-navy/70">{item.author}</td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === "Published" ? "bg-success/5 border-success/20 text-success" :
                        item.status === "Draft" ? "bg-warning/5 border-warning/20 text-warning" :
                        "bg-danger/5 border-danger/20 text-danger"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 text-primary-navy/70 font-semibold">{formatViews(item.views)}</td>

                    {/* Date */}
                    <td className="py-3 px-4 text-primary-navy/40">{item.date}</td>

                    {/* Actions Menu */}
                    <td className="py-3 px-6 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/40 hover:text-primary-navy cursor-pointer transition-colors"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {/* Dropdown Menu actions */}
                      <AnimatePresence>
                        {activeMenuId === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveMenuId(null)} 
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-6 mt-1.5 w-36 bg-white border border-border-custom p-1.5 rounded-xl shadow-premium z-20 text-left flex flex-col gap-1"
                            >
                              <Link
                                href={`/dashboard/content/edit/${item.id}`}
                                className="flex items-center gap-2 text-xs text-primary-navy/80 hover:text-primary-navy hover:bg-primary-navy/[0.02] px-2.5 py-1.5 rounded-lg transition-colors font-ui"
                              >
                                <Edit2 size={12} />
                                <span>Edit</span>
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(item.id, item.status)}
                                className="flex items-center gap-2 text-xs text-primary-navy/80 hover:text-primary-navy hover:bg-primary-navy/[0.02] px-2.5 py-1.5 rounded-lg transition-colors font-ui text-left"
                              >
                                <Globe size={12} />
                                <span>{item.status === "Published" ? "Keep Draft" : "Publish"}</span>
                              </button>
                              <div className="h-[1px] bg-border-custom/60 my-0.5" />
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="flex items-center gap-2 text-xs text-danger hover:bg-danger/5 px-2.5 py-1.5 rounded-lg transition-colors font-ui text-left"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <p className="text-xs text-primary-navy/35 font-ui">No content matching the active filters found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="border-t border-border-custom bg-background/20 px-6 py-4 flex items-center justify-between font-ui text-[11px] text-primary-navy/40">
          <span>Showing 1 to {filteredContent.length} of {contentList.length} results</span>
          
          <div className="flex items-center gap-1.5">
            <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50 disabled:opacity-50">
              <ChevronLeft size={13} />
            </button>
            <button className="w-5 h-5 flex items-center justify-center rounded bg-primary-navy text-white font-semibold">
              1
            </button>
            <button className="w-5 h-5 flex items-center justify-center rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer">
              2
            </button>
            <button className="w-5 h-5 flex items-center justify-center rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer">
              3
            </button>
            <span className="px-1 text-primary-navy/20">...</span>
            <button className="w-5 h-5 flex items-center justify-center rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer">
              36
            </button>
            <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
