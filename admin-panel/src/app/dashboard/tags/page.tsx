"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  Tag as TagIcon, 
  Plus, 
  Trash2, 
  Combine, 
  Search, 
  RefreshCw,
  Sparkles
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function TagsPage() {
  const { tags, addTag, deleteTag, mergeTags } = useAdminStore();
  const [search, setSearch] = useState("");
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#24385A");

  // Merge tool state
  const [sourceTagId, setSourceTagId] = useState("");
  const [targetTagId, setTargetTagId] = useState("");

  const presetColors = [
    "#24385A", // Navy
    "#D6A04A", // Gold
    "#62B06E", // Green
    "#D45B5B", // Red
    "#8E7CC3", // Purple
    "#45818E", // Teal
    "#E06666", // Light Red
    "#3D85C6"  // Blue
  ];

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    // Check if tag already exists
    if (tags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
      toast.error("Tag name already exists.");
      return;
    }

    addTag(tagName, tagColor);
    setTagName("");
    toast.success(`Tag "${tagName}" created successfully!`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tag? Reference counts will be disconnected.")) {
      deleteTag(id);
      toast.success("Tag deleted successfully!");
    }
  };

  const handleMerge = () => {
    if (!sourceTagId || !targetTagId) {
      toast.error("Please select both a source tag and a target tag.");
      return;
    }

    if (sourceTagId === targetTagId) {
      toast.error("Source and target tags must be different.");
      return;
    }

    const sourceTag = tags.find(t => t.id === sourceTagId);
    const targetTag = tags.find(t => t.id === targetTagId);

    if (confirm(`Are you sure you want to merge "${sourceTag?.name}" into "${targetTag?.name}"? All content tags referencing "${sourceTag?.name}" will be updated to "${targetTag?.name}".`)) {
      mergeTags(sourceTagId, targetTagId);
      setSourceTagId("");
      setTargetTagId("");
      toast.success("Tags successfully merged and references updated!");
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none font-ui relative">
      <Toaster position="top-right" />

      {/* Header Row */}
      <div>
        <h2 className="font-heading text-3xl font-bold text-primary-navy">Tags Management</h2>
        <p className="text-xs text-primary-navy/40 mt-1 font-light font-ui">Track and consolidate tag references across CMS assets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Searchable Tag Badges Grid - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom/50 pb-3">
              <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
                Active Tags Directory
              </h3>
              
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-navy/30">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full pl-9 pr-4 py-1.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Tags Badges wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div 
                    key={tag.id}
                    className="flex items-center justify-between p-3 bg-white border border-border-custom hover:border-accent-gold/20 rounded-xl group transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: tag.color }} 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-primary-navy truncate">{tag.name}</p>
                        <p className="text-[9px] text-primary-navy/40 font-light">{tag.count} references</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className="p-1 rounded-lg text-primary-navy/20 hover:text-danger hover:bg-danger/5 group-hover:opacity-100 opacity-0 cursor-pointer transition-all"
                      title="Delete tag"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-primary-navy/30 text-xs">
                  No matching tags found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Operations Panel */}
        <div className="space-y-6">
          
          {/* Card A: Create Tag Form */}
          <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider border-b border-border-custom/50 pb-2">
              Create Tag
            </h3>

            <form onSubmit={handleCreateTag} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                  Tag Name *
                </label>
                <input
                  type="text"
                  required
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g. Awakening"
                  className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy placeholder-primary-navy/30 focus:border-accent-gold/40 outline-none transition-colors"
                />
              </div>

              {/* Color label selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider block">
                  Tag Color Label
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTagColor(color)}
                      className="w-5 h-5 rounded-full border border-border-custom cursor-pointer flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {tagColor === color && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                  {/* Custom color hex input */}
                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    className="w-5 h-5 rounded-full border border-border-custom cursor-pointer p-0 overflow-hidden outline-none"
                    title="Choose custom color"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary-navy hover:bg-primary-navy/90 text-white rounded-button text-xs font-semibold shadow-soft hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                <span>Create Tag</span>
              </button>
            </form>
          </div>

          {/* Card B: Tag Consolidation / Merge Console */}
          <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 border-b border-border-custom/50 pb-2">
              <Combine size={16} className="text-accent-gold" />
              <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
                Tag Merger Console
              </h3>
            </div>
            
            <p className="text-[10px] text-primary-navy/50 leading-relaxed font-light font-ui">
              Consolidate tags that are redundant. All references pointing to the Source Tag will instantly update to target the new selection.
            </p>

            <div className="space-y-4 pt-2">
              {/* Source selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                  Source Tag (will be deleted)
                </label>
                <select
                  value={sourceTagId}
                  onChange={(e) => setSourceTagId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy outline-none cursor-pointer"
                >
                  <option value="">Select source tag...</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.count} refs)</option>
                  ))}
                </select>
              </div>

              {/* Target selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                  Target Tag (will retain counts)
                </label>
                <select
                  value={targetTagId}
                  onChange={(e) => setTargetTagId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy outline-none cursor-pointer"
                >
                  <option value="">Select target tag...</option>
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.count} refs)</option>
                  ))}
                </select>
              </div>

              {/* Action Merge button */}
              <button
                onClick={handleMerge}
                className="w-full py-3 bg-white border border-border-custom hover:bg-primary-navy hover:text-white text-primary-navy rounded-button text-xs font-semibold shadow-soft cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} />
                <span>Merge and Update</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
