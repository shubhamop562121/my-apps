import { useState } from "react";
import { Save, Globe, Bell, Shield, Database, Phone, Mail, CheckCircle2, KeyRound, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Layout from "@/components/Layout";
import { getAdminCreds, saveAdminCreds } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";

const STORAGE_KEY = "km_contact_settings";

function loadContactSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { supportEmail: "support@kaammitra.in", supportPhone: "+91 88000 00000", supportHours: "Mon–Sat, 9am–6pm" };
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const initial = loadContactSettings();
  const currentCreds = getAdminCreds();

  const [saved, setSaved] = useState(false);
  const [credSaved, setCredSaved] = useState(false);
  const [credError, setCredError] = useState("");

  const [appName, setAppName] = useState("KaamMitra");
  const [tagline, setTagline] = useState("Find Skilled Workers Near You");
  const [supportEmail, setSupportEmail] = useState<string>(initial.supportEmail);
  const [supportPhone, setSupportPhone] = useState<string>(initial.supportPhone);
  const [supportHours, setSupportHours] = useState<string>(initial.supportHours);
  const [defaultCity, setDefaultCity] = useState("New Delhi");
  const [notifyNewWorker, setNotifyNewWorker] = useState(true);
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyNewReview, setNotifyNewReview] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [workerApproval, setWorkerApproval] = useState(true);

  const [newEmail, setNewEmail] = useState(currentCreds.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputCls = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ supportEmail, supportPhone, supportHours }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCredSave = () => {
    setCredError("");
    const creds = getAdminCreds();

    if (currentPassword !== creds.password) {
      setCredError("Current password is incorrect.");
      return;
    }
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      setCredError("Enter a valid email address.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setCredError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setCredError("New passwords do not match.");
      return;
    }

    saveAdminCreds(newEmail, newPassword || creds.password);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCredSaved(true);
    setTimeout(() => {
      setCredSaved(false);
      logout();
    }, 1500);
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

  const PasswordField = ({
    label, value, onChange, show, onToggle, placeholder,
  }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string }) => (
    <div>
      <label className="text-xs font-semibold mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={inputCls + " pr-10"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <Layout title="Settings">
      <div className="max-w-2xl space-y-6">

        <Section icon={KeyRound} title="Admin Login Credentials">
          <p className="text-xs text-muted-foreground mb-4">
            Change the email and password used to log in to this admin panel. You'll be logged out after saving.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block">Login Email</label>
              <input
                type="email"
                className={inputCls}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@kaammitra.in"
              />
            </div>
            <PasswordField
              label="Current Password (required to confirm)"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent(!showCurrent)}
            />
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-3">Leave the new password fields blank to keep your current password.</p>
              <div className="grid grid-cols-1 gap-3">
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew(!showNew)}
                  placeholder="Min. 6 characters"
                />
                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirm}
                  onToggle={() => setShowConfirm(!showConfirm)}
                />
              </div>
            </div>

            {credError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{credError}</p>
              </div>
            )}

            {credSaved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <CheckCircle2 size={14} className="text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700 font-medium">Credentials updated! Logging you out…</p>
              </div>
            )}

            <button
              onClick={handleCredSave}
              className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
            >
              <KeyRound size={14} /> Update Login Credentials
            </button>
          </div>
        </Section>

        <Section icon={Globe} title="App Configuration">
          <div className="grid grid-cols-1 gap-4">
            <div><label className="text-xs font-semibold mb-1 block">App Name</label><input className={inputCls} value={appName} onChange={(e) => setAppName(e.target.value)} /></div>
            <div><label className="text-xs font-semibold mb-1 block">Tagline</label><input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
            <div><label className="text-xs font-semibold mb-1 block">Default City</label><input className={inputCls} value={defaultCity} onChange={(e) => setDefaultCity(e.target.value)} /></div>
          </div>
        </Section>

        <Section icon={Phone} title="Help & Support Contact">
          <p className="text-xs text-muted-foreground mb-4">
            These details appear on the KaamMitra app's Help page. Update them here and save — users will see the new contact info immediately.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1 block">Support Phone Number</label>
              <input className={inputCls} type="tel" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Support Email Address</label>
              <input className={inputCls} type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@kaammitra.in" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Support Hours</label>
              <input className={inputCls} value={supportHours} onChange={(e) => setSupportHours(e.target.value)} placeholder="Mon–Sat, 9am–6pm" />
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-primary mb-1">Preview — How it appears in the app</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone size={11} className="text-primary" />
                <span>{supportPhone || "+91 XXXXX XXXXX"} · {supportHours || "Mon–Sat, 9am–6pm"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Mail size={11} className="text-primary" />
                <span>{supportEmail || "support@kaammitra.in"}</span>
              </div>
            </div>
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

        <div className="flex justify-end items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 size={15} /> Settings saved — app updated
            </span>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Save size={15} /> Save Settings
          </button>
        </div>

      </div>
    </Layout>
  );
}
