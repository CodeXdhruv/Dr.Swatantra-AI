"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  Plus, 
  Search, 
  Filter, 
  Folder, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video, 
  Copy, 
  Trash2, 
  Upload,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import R2Uploader from "@/components/ui/R2Uploader";
import toast, { Toaster } from "react-hot-toast";

type TabType = "all" | "image" | "pdf" | "audio" | "video";

export default function MediaLibraryPage() {
  const { mediaLibrary, uploadMediaItem, deleteMediaItem } = useAdminStore();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("All Folders");
  const [showUploader, setShowUploader] = useState(false);

  // Copy Public Link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Public URL copied to clipboard!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this file from Cloudflare R2?")) {
      deleteMediaItem(id);
      toast.success("File deleted successfully!");
    }
  };

  // Filter files
  const filteredFiles = mediaLibrary.filter((file) => {
    const matchesTab = activeTab === "all" || file.type === activeTab;
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = folderFilter === "All Folders" || file.folder === folderFilter;
    return matchesTab && matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6 select-none font-ui relative">
      <Toaster position="top-right" />

      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-primary-navy">Media Library</h2>
          <p className="text-xs text-primary-navy/40 mt-1 font-light">Manage all your media files in one place.</p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-navy hover:bg-primary-navy/90 text-white rounded-button text-xs font-semibold shadow-soft hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <Plus size={14} className={`transition-transform duration-200 ${showUploader ? "rotate-45" : ""}`} />
          <span>{showUploader ? "Close Uploader" : "Upload New"}</span>
        </button>
      </div>

      {/* Collapsible Uploader Frame */}
      {showUploader && (
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft max-w-xl mx-auto space-y-4">
          <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
            Direct Cloudflare R2 Pipeline
          </h3>
          <R2Uploader
            label="Upload Any Resource (Image, Audio, Video, PDF)"
            acceptType="image"
            onUploadSuccess={(file) => {
              toast.success(`Successfully uploaded "${file.name}"`);
              setShowUploader(false);
            }}
            onRemove={() => {}}
          />
        </div>
      )}

      {/* Filter and Tab Section */}
      <div className="bg-white border border-border-custom rounded-2xl p-4 shadow-soft space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          
          {/* Left search & filters */}
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-navy/30">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors"
              />
            </div>

            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="border border-border-custom bg-white px-3.5 py-2 text-xs rounded-input text-primary-navy/70 focus:text-primary-navy outline-none cursor-pointer min-w-[130px]"
            >
              <option>All Folders</option>
              <option>Thumbnails</option>
              <option>Books</option>
              <option>Articles</option>
              <option>Audios</option>
              <option>Videos</option>
            </select>

            <button
              className="flex items-center gap-2 px-4 py-2 border border-border-custom bg-white text-primary-navy/70 hover:text-primary-navy hover:border-accent-gold/40 rounded-input text-xs font-semibold cursor-pointer transition-all"
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

          {/* Right horizontal tabs */}
          <div className="flex bg-background p-1 rounded-xl border border-border-custom/60">
            {(["all", "image", "pdf", "audio", "video"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold capitalize cursor-pointer transition-all duration-200 ${
                  activeTab === tab 
                    ? "bg-white text-primary-navy shadow-sm" 
                    : "text-primary-navy/40 hover:text-primary-navy/70"
                }`}
              >
                {tab === "pdf" ? "Documents" : tab === "all" ? "All Files" : `${tab}s`}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Media Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div 
              key={file.id} 
              className="bg-white border border-border-custom rounded-card overflow-hidden shadow-soft hover:shadow-premium group flex flex-col justify-between transition-all duration-300"
            >
              {/* Asset Box Display */}
              <div className="aspect-[4/3] bg-background border-b border-border-custom/50 flex items-center justify-center relative overflow-hidden group">
                
                {/* Format Specific Previewers */}
                {file.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      file.name === "science-of-soul.jpg" ? "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=200&h=150&q=80" :
                      file.name === "meditation-cover.jpg" ? "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&h=150&q=80" :
                      file.name === "inner-peace.jpg" ? "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=200&h=150&q=80" :
                      "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=200&h=150&q=80"
                    }
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : file.type === "video" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary-navy/5 text-primary-navy/40 relative">
                    <Video size={36} className="stroke-[1.2]" />
                    {file.duration && (
                      <span className="absolute bottom-2.5 right-2.5 bg-primary-navy/80 text-white text-[8px] font-semibold font-mono px-1.5 py-0.5 rounded">
                        {file.duration}
                      </span>
                    )}
                  </div>
                ) : file.type === "audio" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary-navy/5 text-primary-navy/40 relative">
                    <Music size={36} className="stroke-[1.2]" />
                    {file.duration && (
                      <span className="absolute bottom-2.5 right-2.5 bg-primary-navy/80 text-white text-[8px] font-semibold font-mono px-1.5 py-0.5 rounded">
                        {file.duration}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-primary-navy/5 text-primary-navy/40">
                    <FileText size={36} className="stroke-[1.2]" />
                  </div>
                )}

                {/* Floating operations panel (shows on hover) */}
                <div className="absolute inset-0 bg-primary-navy/40 backdrop-blur-xs flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleCopyLink(file.url)}
                    className="p-2 bg-white rounded-full text-primary-navy hover:text-accent-gold shadow-md cursor-pointer transition-colors"
                    title="Copy Public URL"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white rounded-full text-primary-navy hover:text-accent-gold shadow-md cursor-pointer transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 bg-white rounded-full text-danger hover:bg-danger hover:text-white shadow-md cursor-pointer transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Card Meta details */}
              <div className="p-4 space-y-1">
                <p className="text-xs font-semibold text-primary-navy truncate">{file.name}</p>
                <div className="flex justify-between items-center text-[9px] text-primary-navy/40 mt-1">
                  <span>{file.date}</span>
                  <span className="font-semibold">{file.size}</span>
                </div>
                {file.dimensions && (
                  <p className="text-[8px] text-primary-navy/30 text-right">{file.dimensions} px</p>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <p className="text-xs text-primary-navy/35">No media files match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border border-border-custom rounded-2xl px-6 py-4 flex items-center justify-between text-[11px] text-primary-navy/40 shadow-soft">
        <span>Showing 1 to {filteredFiles.length} of {mediaLibrary.length} files</span>
        
        <div className="flex items-center gap-1.5">
          <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50">
            <ChevronLeft size={13} />
          </button>
          <button className="w-5 h-5 flex items-center justify-center rounded bg-primary-navy text-white font-semibold">
            1
          </button>
          <button className="w-5 h-5 flex items-center justify-center rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer">
            2
          </button>
          <span className="px-1 text-primary-navy/20">...</span>
          <button className="w-5 h-5 flex items-center justify-center rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer">
            20
          </button>
          <button className="p-1 rounded border border-border-custom bg-white hover:bg-primary-navy/[0.02] cursor-pointer text-primary-navy/50">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}
