"use client";

import { useAdminStore } from "@/store/adminStore";
import { 
  FileText, 
  Eye, 
  Download, 
  Bookmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  BookOpen, 
  CheckCircle,
  Plus,
  Upload,
  FolderPlus
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Link from "next/link";

export default function DashboardPage() {
  const { contentList, activityLogs } = useAdminStore();

  // Metrics calculating
  const totalContent = contentList.length;
  const publishedContent = contentList.filter(item => item.status === "Published").length;
  const publishedPercentage = totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0;
  
  const totalViews = contentList.reduce((acc, c) => acc + c.views, 0);
  const totalDownloads = contentList.reduce((acc, c) => acc + c.downloads, 0);

  // Mock chart data for weekly views
  const overviewChartData = [
    { name: "May 12", views: 12000 },
    { name: "May 13", views: 19000 },
    { name: "May 14", views: 15000 },
    { name: "May 15", views: 24000 },
    { name: "May 16", views: 22000 },
    { name: "May 17", views: 20000 },
    { name: "May 18", views: 27000 }
  ];

  // Mock pie chart data for content distribution
  const typeDistributionData = [
    { name: "Books", value: 45, color: "#24385A" },
    { name: "Articles", value: 22, color: "#D6A04A" },
    { name: "Videos", value: 15, color: "#62B06E" },
    { name: "Audios", value: 10, color: "#45818E" },
    { name: "Others", value: 8, color: "#D45B5B" }
  ];

  // Top viewed contents
  const topContent = [...contentList]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="space-y-8 select-none">
      {/* Title Header */}
      <div>
        <h2 className="font-heading text-3xl font-bold text-primary-navy">Dashboard</h2>
        <p className="text-xs text-primary-navy/40 mt-1 font-ui font-light">Overview of your platform.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-primary-navy/40 uppercase tracking-wider font-ui">
              Total Content
            </span>
            <FileText size={16} className="text-accent-gold" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-navy">{totalContent}</span>
            <span className="text-[10px] text-success font-semibold flex items-center font-ui">
              <ArrowUpRight size={10} className="mr-0.5" /> +12 this week
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-primary-navy/40 uppercase tracking-wider font-ui">
              Published
            </span>
            <CheckCircle size={16} className="text-success" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-navy">{publishedContent}</span>
            <span className="text-[10px] text-primary-navy/40 font-ui">
              {publishedPercentage}% of total
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-primary-navy/40 uppercase tracking-wider font-ui">
              Total Views
            </span>
            <Eye size={16} className="text-primary-navy/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-navy">
              {(totalViews / 1000).toFixed(1)}K
            </span>
            <span className="text-[10px] text-success font-semibold flex items-center font-ui">
              <ArrowUpRight size={10} className="mr-0.5" /> +18.2%
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft hover:shadow-premium transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-primary-navy/40 uppercase tracking-wider font-ui">
              Total Downloads
            </span>
            <Download size={16} className="text-primary-navy/50" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-navy">
              {(totalDownloads / 1000).toFixed(1)}K
            </span>
            <span className="text-[10px] text-success font-semibold flex items-center font-ui">
              <ArrowUpRight size={10} className="mr-0.5" /> +14.7%
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Visual charts & Quick lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Overview Chart - Spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-heading text-lg font-bold text-primary-navy">Content Overview</h4>
              <p className="text-[10px] text-primary-navy/40 font-ui font-light">Views trends over time</p>
            </div>
            <select className="border border-border-custom px-3 py-1 text-[11px] rounded-lg text-primary-navy outline-none font-ui cursor-pointer bg-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewChartData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#24385A", opacity: 0.4, fontSize: 10, fontFamily: "Inter" }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#24385A", opacity: 0.4, fontSize: 10, fontFamily: "Inter" }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E8EDF4", 
                    borderRadius: "12px", 
                    boxShadow: "0 8px 30px rgba(0,0,0,.04)" 
                  }}
                  labelStyle={{ fontFamily: "Cormorant Garamond", fontWeight: "bold", color: "#24385A" }}
                  itemStyle={{ fontFamily: "Inter", fontSize: 11, color: "#D6A04A" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#24385A" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#24385A" }} 
                  activeDot={{ r: 5, fill: "#D6A04A", stroke: "#FFFFFF", strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Content List Card - 1 col */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="font-heading text-lg font-bold text-primary-navy">Top Content</h4>
                <p className="text-[10px] text-primary-navy/40 font-ui font-light">Most viewed content items</p>
              </div>
            </div>
            <div className="space-y-4">
              {topContent.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  {/* Mock thumbnail square */}
                  <div className="w-9 h-11 bg-primary-navy/5 border border-border-custom rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen size={14} className="text-primary-navy/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary-navy truncate font-ui">{item.title}</p>
                    <p className="text-[9px] text-primary-navy/40 mt-0.5 font-ui">{item.views.toLocaleString()} views</p>
                  </div>
                  <span className="text-[10px] bg-background border border-border-custom px-2 py-0.5 rounded-lg text-primary-navy/60 font-ui">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-border-custom mt-4">
            <Link 
              href="/dashboard/content" 
              className="text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors flex items-center justify-center gap-1 font-ui"
            >
              <span>View all content</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content by Type Donut chart */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-navy">Content by Type</h4>
            <p className="text-[10px] text-primary-navy/40 font-ui font-light">Distribution percentages</p>
            
            <div className="h-[180px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border-custom font-ui text-[10px] text-primary-navy/70">
            {typeDistributionData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}</span>
                <span className="font-semibold text-primary-navy/40 ml-auto">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between lg:col-span-2">
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-navy">Recent Activity</h4>
            <p className="text-[10px] text-primary-navy/40 font-ui font-light">Live timeline logs</p>

            <div className="space-y-4 mt-6">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={log.adminAvatar}
                    alt={log.adminName}
                    className="w-8 h-8 rounded-full object-cover border border-border-custom mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary-navy leading-relaxed font-ui">
                      <span className="font-semibold">{log.adminName}</span>: {log.details}
                    </p>
                    <span className="text-[9px] text-primary-navy/35 font-ui mt-0.5 block">{log.timestamp}</span>
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider font-ui px-2 py-0.5 rounded-lg border ${
                    log.action === "Publish" ? "bg-success/5 border-success/20 text-success" :
                    log.action === "Delete" ? "bg-danger/5 border-danger/20 text-danger" :
                    log.action === "Upload" ? "bg-accent-gold/5 border-accent-gold/20 text-accent-gold" :
                    "bg-primary-navy/5 border-primary-navy/10 text-primary-navy/60"
                  }`}>
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border-custom mt-4">
            <Link 
              href="/dashboard/activity" 
              className="text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors flex items-center justify-center gap-1 font-ui"
            >
              <span>View all activity logs</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft">
        <h4 className="font-heading text-lg font-bold text-primary-navy mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/content/new"
            className="flex items-center gap-3 p-4 rounded-xl border border-border-custom bg-white hover:border-accent-gold/40 hover:bg-primary-navy/[0.01] transition-all group font-ui"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-gold/5 flex items-center justify-center text-accent-gold group-hover:scale-105 transition-transform">
              <Plus size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-primary-navy">Add Content</p>
              <p className="text-[9px] text-primary-navy/40 mt-0.5">Upload new books or guides</p>
            </div>
          </Link>

          <Link
            href="/dashboard/media"
            className="flex items-center gap-3 p-4 rounded-xl border border-border-custom bg-white hover:border-accent-gold/40 hover:bg-primary-navy/[0.01] transition-all group font-ui"
          >
            <div className="w-8 h-8 rounded-lg bg-success/5 flex items-center justify-center text-success group-hover:scale-105 transition-transform">
              <Upload size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-primary-navy">Upload Media</p>
              <p className="text-[9px] text-primary-navy/40 mt-0.5">Manage assets in R2 Cloud</p>
            </div>
          </Link>

          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 p-4 rounded-xl border border-border-custom bg-white hover:border-accent-gold/40 hover:bg-primary-navy/[0.01] transition-all group font-ui"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-navy/5 flex items-center justify-center text-primary-navy/50 group-hover:scale-105 transition-transform">
              <FolderPlus size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-primary-navy">Manage Categories</p>
              <p className="text-[9px] text-primary-navy/40 mt-0.5">Reorder nested category structure</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
