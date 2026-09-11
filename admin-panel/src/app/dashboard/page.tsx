"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Phone,
  Calendar,
  Download,
  Eye,
  Bookmark
} from "lucide-react";

export default function AnalyticsPage() {
  const { currentAdmin } = useAdminStore();
  const [greeting, setGreeting] = useState("Good Morning");
  const [timeRange, setTimeRange] = useState("Weekly");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Summary Metrics
  const summaryMetrics = [
    { name: "Avg. Completion Rate", value: "84.2%", desc: "Chapter completion in Books", icon: Activity, trend: "+3.4% vs last month" },
    { name: "Weekly Growth", value: "+12.8%", desc: "New registered mobile readers", icon: TrendingUp, trend: "Consistent upward path" },
    { name: "Session Duration", value: "18.5 mins", desc: "Average app usage duration", icon: Clock, trend: "+1.2m this week" },
    { name: "Active Mobile Users", value: "24.2K", desc: "Active in the last 24h", icon: Phone, trend: "Peak user concurrency" }
  ];

  // Mock growth trend data
  const growthTrendData = [
    { name: "Mon", Views: 3200, Downloads: 1200 },
    { name: "Tue", Views: 4100, Downloads: 1900 },
    { name: "Wed", Views: 3800, Downloads: 1500 },
    { name: "Thu", Views: 5100, Downloads: 2200 },
    { name: "Fri", Views: 4900, Downloads: 2500 },
    { name: "Sat", Views: 6200, Downloads: 3100 },
    { name: "Sun", Views: 7500, Downloads: 3900 }
  ];

  // Popular categories bar chart data
  const categoryData = [
    { name: "Spirituality", count: 18400 },
    { name: "Meditation", count: 12100 },
    { name: "Wisdom", count: 9400 },
    { name: "Mindfulness", count: 6200 },
    { name: "Life Balance", count: 4800 }
  ];

  // Popular tags data
  const tagData = [
    { name: "Wisdom", count: 980 },
    { name: "Soul", count: 850 },
    { name: "Awakening", count: 720 },
    { name: "Science", count: 540 },
    { name: "Karma", count: 410 }
  ];

  const completionData = [
    { name: "Completed", value: 84, color: "#24385A" },
    { name: "Dropped", value: 16, color: "#E8EDF4" }
  ];

  return (
    <div className="space-y-8 select-none font-ui">
      {/* Banner Section */}
      <div className="rounded-[20px] overflow-hidden relative shadow-sm h-[200px]" style={{ background: 'linear-gradient(90deg, #F5F0E6 0%, #E9E1D3 100%)' }}>
        <div className="absolute inset-0 z-0 opacity-80" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80')",
          backgroundPosition: "center right",
          backgroundSize: "cover",
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 100%)'
        }} />
        
        <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between max-w-[80%] sm:max-w-[60%]">
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary-navy mb-2">{greeting},<br/>{currentAdmin?.name || 'Dr. Jain'}</h1>
          </div>
          <p className="text-[13px] text-primary-navy/70 font-ui font-medium">
            Thanks for being part of Atmik.<br/>
            Let's create a little more light today.
          </p>
        </div>
        
        {/* Quote floating right */}
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-12 text-right">
          <p className="font-heading text-xl italic text-primary-navy max-w-[200px] mb-2 leading-tight">
            "A kinder world begins with better content."
          </p>
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-navy/60 font-ui">— ATMIK</span>
        </div>
      </div>

      <div className="flex justify-end items-center">

        <div className="flex bg-white border border-border-custom p-1 rounded-xl shadow-soft">
          {["Weekly", "Monthly", "Yearly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold cursor-pointer transition-all duration-200 ${
                timeRange === range 
                  ? "bg-primary-navy text-white shadow-sm" 
                  : "text-primary-navy/40 hover:text-primary-navy/70"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-border-custom rounded-card p-6 shadow-soft hover:shadow-premium transition-all duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-primary-navy/40 uppercase tracking-wider">
                {m.name}
              </span>
              <m.icon size={16} className="text-accent-gold" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-primary-navy">{m.value}</span>
              <p className="text-[10px] text-primary-navy/40 mt-1">{m.desc}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-border-custom/50 flex items-center justify-between text-[9px] font-semibold text-success uppercase">
              <span>{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Growth & Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Area Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h4 className="font-heading text-lg font-bold text-primary-navy">Views & Downloads Growth</h4>
              <p className="text-[10px] text-primary-navy/40 font-light mt-0.5">Comparing app hits against asset downloads</p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrendData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24385A" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#24385A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6A04A" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#D6A04A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                />
                <Area type="monotone" dataKey="Views" stroke="#24385A" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="Downloads" stroke="#D6A04A" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Gauge donut (1 col) */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h4 className="font-heading text-lg font-bold text-primary-navy">Book Reads Completion</h4>
            <p className="text-[10px] text-primary-navy/40 font-light mt-0.5">Average readers completing books to the last chapter</p>

            <div className="h-[180px] w-full mt-4 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary-navy">84%</span>
                <span className="text-[9px] uppercase tracking-wider text-primary-navy/40 font-semibold mt-0.5">Completion</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-custom space-y-2 text-[10px] text-primary-navy/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-navy" />
                <span>Readers Completing books</span>
              </div>
              <span className="font-semibold text-primary-navy">84%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-border-custom" />
                <span>Dropped within first 3 chapters</span>
              </div>
              <span className="font-semibold text-primary-navy/40">16%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Popular categories & tags vertical bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Popular Categories */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft">
          <h4 className="font-heading text-lg font-bold text-primary-navy mb-4">Views by Category</h4>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" horizontal={false} />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#24385A", opacity: 0.4, fontSize: 9 }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#24385A", opacity: 0.7, fontSize: 9, fontWeight: "semibold" }}
                  width={80}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#24385A" radius={[0, 8, 8, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft">
          <h4 className="font-heading text-lg font-bold text-primary-navy mb-4">Tag References Usage</h4>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tagData} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#24385A", opacity: 0.7, fontSize: 9, fontWeight: "semibold" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#24385A", opacity: 0.4, fontSize: 9 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#D6A04A" radius={[8, 8, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
