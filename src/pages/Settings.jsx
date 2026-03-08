import React, { useState, useEffect } from "react";
import { settingsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const IC = {
  check: "M20 6L9 17l-5-5",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  store: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  globe: "M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
};

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-800 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-slate-200 text-sm font-medium">{label}</p>
        {desc && <p className="text-slate-500 text-xs mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="toggle-track flex-shrink-0"
        style={{ background: checked ? "#6366f1" : "#2a3241" }}>
        <div className="toggle-thumb" style={{ left: checked ? 24 : 4 }} />
      </button>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 overflow-hidden" style={{ background: "#131920" }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
          <Icon d={icon} size={15} className="text-indigo-400" />
        </div>
        <h3 className="text-white font-bold font-sora">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    settingsApi.get().then((s) => {
      setSettings(s);
      setLoading(false);
    });
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (section, data) => {
    setSaving((s) => ({ ...s, [section]: true }));
    await settingsApi.update(section, data);
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], ...data } }));
    setSaving((s) => ({ ...s, [section]: false }));
    showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
  };

  const saveProfile = async () => {
    setSaving((s) => ({ ...s, profile: true }));
    await new Promise((r) => setTimeout(r, 500));
    updateProfile(profile);
    setSaving((s) => ({ ...s, profile: false }));
    showToast("Profile updated successfully!");
  };

  const changePassword = async () => {
    setPwError("");
    if (!passwords.current) { setPwError("Enter your current password."); return; }
    if (passwords.next.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (passwords.next !== passwords.confirm) { setPwError("Passwords do not match."); return; }
    setSaving((s) => ({ ...s, password: true }));
    await new Promise((r) => setTimeout(r, 600));
    setSaving((s) => ({ ...s, password: false }));
    setPasswords({ current: "", next: "", confirm: "" });
    showToast("Password changed successfully!");
  };

  const toggleNotif = (key) => {
    if (!settings) return;
    const updated = { ...settings.notifications, [key]: !settings.notifications[key] };
    save("notifications", updated);
  };

  const toggleSecurity = (key) => {
    if (!settings) return;
    const updated = { ...settings.security, [key]: !settings.security[key] };
    save("security", updated);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl h-48 border border-slate-800 animate-pulse" style={{ background: "#131920" }} />
        ))}
      </div>
    );
  }

  const PwInput = ({ name, label, placeholder }) => (
    <div>
      <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPw[name] ? "text" : "password"}
          value={passwords[name]}
          onChange={(e) => setPasswords((p) => ({ ...p, [name]: e.target.value }))}
          className="input-dark pr-10"
          placeholder={placeholder}
        />
        <button type="button" onClick={() => setShowPw((s) => ({ ...s, [name]: !s[name] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
          <Icon d={showPw[name] ? IC.eyeOff : IC.eye} size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2 animate-slide-in
          ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
          <Icon d={IC.check} size={14} /> {toast.msg}
        </div>
      )}

      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <Section title="Profile Information" icon={IC.user}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#ec4899,#f97316)" }}>
              {user?.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-slate-500 text-sm">{user?.role}</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              style={{ background: "#2a3241" }}>
              <Icon d={IC.upload} size={13} /> Change Photo
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
              <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className="input-dark" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="input-dark" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Phone</label>
              <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="input-dark" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={saveProfile} disabled={saving.profile}
              className="btn-primary flex items-center gap-2">
              {saving.profile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon d={IC.save} size={15} />}
              Save Profile
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notification Preferences" icon={IC.bell}>
          <div>
            {[
              ["email", "Email Notifications", "Receive order and account updates via email"],
              ["push", "Push Notifications", "Browser and device push alerts"],
              ["sms", "SMS Notifications", "Text message alerts for critical events"],
              ["weeklyReport", "Weekly Report", "Automated performance summary every Monday"],
              ["orderUpdates", "Order Updates", "Alerts for order status changes"],
              ["lowStockAlerts", "Low Stock Alerts", "Notify when products reach low stock levels"],
              ["securityAlerts", "Security Alerts", "Login attempts and suspicious activity"],
            ].map(([key, label, desc]) => (
              <Toggle key={key} checked={settings?.notifications?.[key] ?? false}
                onChange={() => toggleNotif(key)} label={label} desc={desc} />
            ))}
          </div>
        </Section>

        {/* Security */}
        <Section title="Security Settings" icon={IC.shield}>
          <div className="space-y-4">
            <Toggle
              checked={settings?.security?.twoFactor ?? true}
              onChange={() => toggleSecurity("twoFactor")}
              label="Two-Factor Authentication"
              desc="Add an extra layer of security to your account"
            />
            <Toggle
              checked={settings?.security?.loginAlerts ?? true}
              onChange={() => toggleSecurity("loginAlerts")}
              label="Login Alerts"
              desc="Get notified of new sign-ins from unknown devices"
            />

            <div className="pt-3 border-t border-slate-800">
              <p className="text-white text-sm font-semibold mb-4">Change Password</p>
              <div className="space-y-3">
                <PwInput name="current" label="Current Password" placeholder="Enter current password" />
                <PwInput name="next" label="New Password" placeholder="Min. 6 characters" />
                <PwInput name="confirm" label="Confirm New Password" placeholder="Repeat new password" />
                {pwError && (
                  <p className="text-red-400 text-xs px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {pwError}
                  </p>
                )}
                <div className="flex justify-end">
                  <button onClick={changePassword} disabled={saving.password} className="btn-primary flex items-center gap-2">
                    {saving.password ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon d={IC.shield} size={15} />}
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                <Icon d={IC.shield} size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 text-sm font-medium">Account is Secured</p>
                <p className="text-emerald-600 text-xs">2FA enabled • Last login: Today, 09:41 AM</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Store Settings */}
        <Section title="Store Configuration" icon={IC.store}>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Store Name", "name", settings?.store?.name || ""],
              ["Support Email", "email", settings?.store?.email || ""],
              ["Support Phone", "phone", settings?.store?.phone || ""],
              ["Website URL", "website", settings?.store?.website || ""],
            ].map(([label, key, val]) => (
              <div key={key} className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">{label}</label>
                <input defaultValue={val}
                  onChange={(e) => setSettings((s) => ({ ...s, store: { ...s.store, [key]: e.target.value } }))}
                  className="input-dark" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Currency</label>
              <select defaultValue={settings?.store?.currency}
                onChange={(e) => setSettings((s) => ({ ...s, store: { ...s.store, currency: e.target.value } }))}
                className="input-dark">
                {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Tax Rate (%)</label>
              <input type="number" defaultValue={settings?.store?.taxRate} step="0.1" min="0" max="100"
                onChange={(e) => setSettings((s) => ({ ...s, store: { ...s.store, taxRate: e.target.value } }))}
                className="input-dark" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Region</label>
              <select defaultValue={settings?.store?.region}
                onChange={(e) => setSettings((s) => ({ ...s, store: { ...s.store, region: e.target.value } }))}
                className="input-dark">
                {["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => save("store", settings.store)} disabled={saving.store}
              className="btn-primary flex items-center gap-2">
              {saving.store ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon d={IC.save} size={15} />}
              Save Store Settings
            </button>
          </div>
        </Section>

        {/* Danger Zone */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}>
          <h3 className="text-red-400 font-bold font-sora mb-1">Danger Zone</h3>
          <p className="text-slate-500 text-xs mb-4">These actions are irreversible. Proceed with caution.</p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
              style={{ border: "1px solid rgba(239,68,68,0.3)" }}
              onClick={() => showToast("Demo: Data cleared would reset to seed data.", "error")}>
              Reset All Data
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
              style={{ border: "1px solid rgba(239,68,68,0.3)" }}
              onClick={() => showToast("Demo: Export not available in demo mode.", "error")}>
              Export & Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
