import { useState } from "react";
import { Save, Globe, Bell, Shield, Database } from "lucide-react";
import Layout from "@/components/Layout";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [appName, setAppName] = useState("KaamMitra");
  const [tagline, setTagline] = useState("Find Skilled Workers Near You");
  const [supportEmail, setSupportEmail] = useState("support@kaammitra.in");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [defaultCity, setDefaultCity] = useState("New Delhi");
  const [notifyNewWorker, setNotifyNewWorker] = useState(true);
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyNewReview, setNotifyNewReview] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [workerApproval, setWorkerApproval] = useState(true);

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ToggleRow = ({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-primary" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Icon size={16} className="text-primary" />
        <h2 className="font-semibold text-foreground text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <Layout title="Settings">
      <div className="max-w-2xl space-y-6">
        <Section icon={Globe} title="App Configuration">
          <div className="grid grid-cols-1 gap-4">
            <div><label className="text-xs font-semibold mb-1 block">App Name</label><input className={inputCls} value={appName} onChange={(e) => setAppName(e.target.value)} /></div>
            <div><label className="text-xs font-semibold mb-1 block">Tagline</label><input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold mb-1 block">Support Email</label><input className={inputCls} type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} /></div>
              <div><label className="text-xs font-semibold mb-1 block">Support Phone</label><input className={inputCls} value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} /></div>
            </div>
            <div><label className="text-xs font-semibold mb-1 block">Default City</label><input className={inputCls} value={defaultCity} onChange={(e) => setDefaultCity(e.target.value)} /></div>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications">
          <ToggleRow label="New Worker Registration" desc="Get notified when a new worker registers" value={notifyNewWorker} onChange={setNotifyNewWorker} />
          <ToggleRow label="New User Registration" desc="Get notified when a new user registers" value={notifyNewUser} onChange={setNotifyNewUser} />
          <ToggleRow label="New Review Posted" desc="Get notified when a review is posted" value={notifyNewReview} onChange={setNotifyNewReview} />
        </Section>

        <Section icon={Shield} title="Security & Access">
          <ToggleRow label="Worker Approval Required" desc="New workers must be approved before going live" value={workerApproval} onChange={setWorkerApproval} />
          <ToggleRow label="Maintenance Mode" desc="App shows maintenance page to all users" value={maintenanceMode} onChange={setMaintenanceMode} />
        </Section>

        <Section icon={Database} title="Firebase Integration">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-700 font-medium">Firebase Configuration</p>
            <p className="text-xs text-blue-600 mt-1">Connect your Firebase project to enable real-time data sync, authentication, and cloud storage.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {["API Key","Auth Domain","Project ID","Storage Bucket","Messaging Sender ID","App ID"].map((field) => (
              <div key={field}><label className="text-xs font-semibold mb-1 block">{field}</label><input className={inputCls} placeholder={`Enter Firebase ${field}`} /></div>
            ))}
          </div>
        </Section>

        <div className="flex justify-end gap-3">
          {saved && <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">✓ Settings saved</p>}
          <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Save size={15} /> Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
}
