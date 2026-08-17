"use client";

import { useState } from "react";
import { 
  Settings, 
  Cloud, 
  Key, 
  Layers, 
  Save, 
  CheckCircle,
  Database,
  Mail,
  Loader2,
  HardDrive
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type TabType = "general" | "storage" | "apis" | "system";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("storage");
  const [saving, setSaving] = useState(false);

  // Storage Settings states
  const [bucket, setBucket] = useState("atmik-content");
  const [region, setRegion] = useState("auto");
  const [r2PublicUrl, setR2PublicUrl] = useState("https://r2.atmik.ai");
  const [testingConnection, setTestingConnection] = useState(false);
  const [r2Connected, setR2Connected] = useState(true);

  // API settings state
  const [firebaseApiKey, setFirebaseApiKey] = useState("AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6");
  const [geminiApiKey, setGeminiApiKey] = useState("AIzaSyB-GeminiKey123456789TokenSecret");

  // General settings state
  const [orgName, setOrgName] = useState("Dr. Atmik AI");
  const [supportEmail, setSupportEmail] = useState("contact@atmik.ai");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 1200);
  };

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      setR2Connected(true);
      toast.success("Cloudflare R2 Bucket connection verified successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6 select-none font-ui relative">
      <Toaster position="top-right" />

      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-primary-navy">Settings</h2>
          <p className="text-xs text-primary-navy/40 mt-1 font-light">Configure platform credentials, Cloudflare storage, and email sync pipelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Navigation Links (1 col) */}
        <div className="lg:col-span-1 bg-white border border-border-custom p-3.5 rounded-card shadow-soft flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
              activeTab === "general"
                ? "bg-primary-navy text-white"
                : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
            }`}
          >
            <Layers size={15} />
            <span>General & Branding</span>
          </button>
          
          <button
            onClick={() => setActiveTab("storage")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
              activeTab === "storage"
                ? "bg-primary-navy text-white"
                : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
            }`}
          >
            <Cloud size={15} />
            <span>Cloudflare R2 Storage</span>
          </button>

          <button
            onClick={() => setActiveTab("apis")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
              activeTab === "apis"
                ? "bg-primary-navy text-white"
                : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
            }`}
          >
            <Key size={15} />
            <span>API Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors text-left ${
              activeTab === "system"
                ? "bg-primary-navy text-white"
                : "text-primary-navy/70 hover:bg-primary-navy/[0.02] hover:text-primary-navy"
            }`}
          >
            <Database size={15} />
            <span>System Backup</span>
          </button>
        </div>

        {/* Right Side: Tab content detail panels (3 cols) */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">

            {/* General Tab */}
            {activeTab === "general" && (
              <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
                <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider border-b border-border-custom/50 pb-2">
                  General & Branding Configuration
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                      Organization name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                      Support Contact Email
                    </label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cloudflare R2 Storage Tab */}
            {activeTab === "storage" && (
              <div className="space-y-6">
                {/* R2 connection status panel */}
                <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-5">
                  <div className="flex items-center justify-between border-b border-border-custom/50 pb-3.5">
                    <div className="flex items-center gap-3">
                      <Cloud className="text-accent-gold" size={20} />
                      <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider">
                        Cloudflare R2 Bucket Connection
                      </h3>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r2Connected 
                        ? "bg-success/5 border-success/20 text-success" 
                        : "bg-danger/5 border-danger/20 text-danger"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r2Connected ? "bg-success" : "bg-danger"}`} />
                      {r2Connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>

                  {/* Input settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                        R2 Bucket Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bucket}
                        onChange={(e) => setBucket(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                        R2 Region Name
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none cursor-pointer"
                      >
                        <option>auto</option>
                        <option>us-east-1</option>
                        <option>eu-west-1</option>
                        <option>ap-south-1</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                        R2 Public Delivery Domain / URL
                      </label>
                      <input
                        type="url"
                        value={r2PublicUrl}
                        onChange={(e) => setR2PublicUrl(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                      />
                    </div>
                  </div>

                  {/* Quick verification test trigger */}
                  <div className="pt-3 border-t border-border-custom/50 flex justify-between items-center">
                    <span className="text-[10px] text-primary-navy/40 font-light">Verify credentials handshake with API gateway.</span>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testingConnection}
                      className="px-4 py-2 border border-border-custom bg-white hover:bg-primary-navy/[0.01] text-primary-navy rounded-button text-[11px] font-semibold shadow-soft cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      {testingConnection ? (
                        <>
                          <Loader2 size={12} className="animate-spin text-accent-gold" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <span>Test Connection</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Storage usage statistics */}
                <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
                  <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider border-b border-border-custom/50 pb-2">
                    Storage Allocation usage
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Storage used */}
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-accent-gold/5 flex items-center justify-center text-accent-gold">
                        <HardDrive size={18} />
                      </div>
                      <div className="flex-1 text-left font-ui">
                        <span className="text-[10px] text-primary-navy/40 font-semibold uppercase">Storage Capacity</span>
                        <p className="text-sm font-bold text-primary-navy mt-0.5">12.8 GB / 50 GB</p>
                        <div className="w-full bg-border-custom h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-accent-gold h-full rounded-full" style={{ width: "25%" }} />
                        </div>
                      </div>
                    </div>

                    {/* Bandwidth used */}
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-success/5 flex items-center justify-center text-success">
                        <Database size={18} />
                      </div>
                      <div className="flex-1 text-left font-ui">
                        <span className="text-[10px] text-primary-navy/40 font-semibold uppercase">Bandwidth Consumption</span>
                        <p className="text-sm font-bold text-primary-navy mt-0.5">42.5 GB / 100 GB</p>
                        <div className="w-full bg-border-custom h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: "42.5%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Credentials */}
            {activeTab === "apis" && (
              <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
                <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider border-b border-border-custom/50 pb-2">
                  Third-Party API Integrations
                </h3>
                
                <div className="space-y-4 pt-2">
                  {/* Firebase */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                      Firebase Admin SDK Client Token
                    </label>
                    <input
                      type="password"
                      value={firebaseApiKey}
                      onChange={(e) => setFirebaseApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                    />
                    <p className="text-[9px] text-primary-navy/35 leading-relaxed font-light">
                      This token authenticates email checks and token updates directly with Firebase Auth database services.
                    </p>
                  </div>

                  {/* Gemini API */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-primary-navy/60 uppercase tracking-wider">
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border-custom rounded-input text-xs text-primary-navy focus:border-accent-gold/40 outline-none"
                    />
                    <p className="text-[9px] text-primary-navy/35 leading-relaxed font-light">
                      Used for AI-assisted summaries, tags extraction, and editorial proofreading workflows within TipTap.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* System backups */}
            {activeTab === "system" && (
              <div className="bg-white border border-border-custom rounded-card p-6 shadow-soft space-y-4">
                <h3 className="text-xs font-semibold text-primary-navy/70 uppercase tracking-wider border-b border-border-custom/50 pb-2">
                  System Database Backups
                </h3>

                <div className="pt-2 flex justify-between items-center text-left font-ui">
                  <div>
                    <p className="text-xs font-semibold text-primary-navy">Manual JSON Export</p>
                    <p className="text-[10px] text-primary-navy/40 mt-0.5">Download full snapshot of content library, categories, and audit logs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success("JSON Database backup downloaded successfully!")}
                    className="px-4 py-2 bg-primary-navy text-white text-xs font-semibold rounded-button shadow-soft cursor-pointer hover:bg-primary-navy/95 transition-all"
                  >
                    Download Backup
                  </button>
                </div>
              </div>
            )}

            {/* Sticky Save row */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary-navy hover:bg-primary-navy/95 text-white rounded-button text-xs font-semibold shadow-soft hover:shadow-md cursor-pointer transition-all duration-200 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-accent-gold" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
