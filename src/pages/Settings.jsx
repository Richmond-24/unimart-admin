
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
  store: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
};

const styles = {
  card: {
    background: "#fff",
    border: "0.5px solid #e8e0d8",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "1.25rem",
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "1rem 1.25rem",
    borderBottom: "0.5px solid #f0e8e0",
    background: "#fffaf7",
  },
  cardIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#fff3eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: { padding: "1.25rem" },
  fieldLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".06em",
    color: "#b07040",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    height: "38px",
    border: "0.5px solid #e0d0c0",
    borderRadius: "8px",
    background: "#fffaf7",
    color: "#1a1208",
    fontSize: "14px",
    padding: "0 12px",
    outline: "none",
  },
  select: {
    width: "100%",
    height: "38px",
    border: "0.5px solid #e0d0c0",
    borderRadius: "8px",
    background: "#fffaf7",
    color: "#1a1208",
    fontSize: "14px",
    padding: "0 12px",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b07040' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "30px",
    cursor: "pointer",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  btnGhostSm: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "#fff3eb",
    border: "0.5px solid #fcd9b6",
    borderRadius: "8px",
    padding: "7px 13px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#c2600a",
    cursor: "pointer",
  },
  btnOutlineDanger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background: "transparent",
    color: "#dc2626",
    border: "0.5px solid #fca5a5",
    borderRadius: "9px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  divider: { border: "none", borderTop: "0.5px solid #f0e8e0", margin: "1rem 0" },
  rowEnd: { display: "flex", justifyContent: "flex-end", marginTop: "1rem" },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingBottom: "1.1rem",
    borderBottom: "0.5px solid #f0e8e0",
    marginBottom: "1.1rem",
  },
  avatar: {
    width: "62px",
    height: "62px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#f97316,#fb923c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "22px",
    fontWeight: 500,
    flexShrink: 0,
  },
  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f0fdf4",
    border: "0.5px solid #bbf7d0",
    borderRadius: "10px",
    padding: "12px 14px",
    marginTop: "12px",
  },
  secureDot: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    background: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dangerZone: {
    background: "#fff5f5",
    border: "0.5px solid #fca5a5",
    borderRadius: "16px",
    padding: "1.25rem",
    marginBottom: "1.25rem",
  },
  errBox: {
    fontSize: "12px",
    color: "#dc2626",
    background: "#fef2f2",
    border: "0.5px solid #fca5a5",
    borderRadius: "8px",
    padding: "8px 12px",
    marginTop: "8px",
  },
  toastSuccess: {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: 999,
    background: "#1a1208",
    color: "#fff",
    borderRadius: "10px",
    padding: "11px 16px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,.15)",
  },
  toastError: {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: 999,
    background: "#7f1d1d",
    color: "#fff",
    borderRadius: "10px",
    padding: "11px 16px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,.15)",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

function Section({ title, icon, children }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div style={styles.cardIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
        <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#1a1208" }}>{title}</h3>
      </div>
      <div style={styles.cardBody}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "11px 0", borderBottom: "0.5px solid #f8f0e8",
    }}>
      <div style={{ flex: 1, paddingRight: "12px" }}>
        <p style={{ fontSize: "14px", color: "#1a1208" }}>{label}</p>
        {desc && <p style={{ fontSize: "12px", color: "#b07040", marginTop: "2px" }}>{desc}</p>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: "relative", width: "44px", height: "26px",
          borderRadius: "13px", flexShrink: 0, cursor: "pointer",
          background: checked ? "#f97316" : "#e8ddd4",
          transition: "background 0.2s",
        }}>
        <div style={{
          position: "absolute", top: "3px",
          left: checked ? "21px" : "3px",
          width: "20px", height: "20px",
          borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          transition: "left 0.2s",
        }} />
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={(e) => (e.target.style.borderColor = "#f97316")}
        onBlur={(e) => (e.target.style.borderColor = "#e0d0c0")}
      />
    </div>
  );
}

function PwInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          style={{ ...styles.input, paddingRight: "36px" }}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={(e) => (e.target.style.borderColor = "#f97316")}
          onBlur={(e) => (e.target.style.borderColor = "#e0d0c0")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          style={{
            position: "absolute", right: "10px", top: "50%",
            transform: "translateY(-50%)", background: "none", border: "none",
            cursor: "pointer", color: show ? "#f97316" : "#b07040",
            display: "flex", alignItems: "center",
          }}>
          <Icon d={show ? IC.eyeOff : IC.eye} size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
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
      <div style={{ padding: "1.5rem", maxWidth: "680px", display: "grid", gap: "1.25rem" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            borderRadius: "16px", height: "180px",
            border: "0.5px solid #e8e0d8", background: "#fffaf7",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem 1rem 3rem", maxWidth: "680px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          ...(toast.type === "success" ? styles.toastSuccess : styles.toastError),
          animation: "slideIn 0.2s ease",
        }}>
          <Icon d={IC.check} size={14} />
          {toast.msg}
        </div>
      )}

      {/* Profile */}
      <Section title="Profile information" icon={IC.user}>
        <div style={styles.avatarRow}>
          <div style={styles.avatar}>{user?.avatar}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#1a1208" }}>{user?.name}</p>
            <p style={{ fontSize: "13px", color: "#b07040", marginTop: "2px" }}>{user?.role}</p>
          </div>
          <button style={styles.btnGhostSm}>
            <Icon d={IC.upload} size={13} />
            Change photo
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <FieldInput label="Full name" value={profile.name}
              onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
          </div>
          <div>
            <FieldInput label="Email" type="email" value={profile.email}
              onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FieldInput label="Phone" value={profile.phone}
              placeholder="+1 (555) 000-0000"
              onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
          </div>
        </div>
        <div style={styles.rowEnd}>
          <button onClick={saveProfile} disabled={saving.profile} style={styles.btnPrimary}>
            {saving.profile
              ? <div style={styles.spinner} />
              : <Icon d={IC.save} size={14} />}
            Save profile
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification preferences" icon={IC.bell}>
        {[
          ["email", "Email notifications", "Receive order and account updates via email"],
          ["push", "Push notifications", "Browser and device push alerts"],
          ["sms", "SMS notifications", "Text message alerts for critical events"],
          ["weeklyReport", "Weekly report", "Automated performance summary every Monday"],
          ["orderUpdates", "Order updates", "Alerts for order status changes"],
          ["lowStockAlerts", "Low stock alerts", "Notify when products reach low stock levels"],
          ["securityAlerts", "Security alerts", "Login attempts and suspicious activity"],
        ].map(([key, label, desc]) => (
          <Toggle key={key}
            checked={settings?.notifications?.[key] ?? false}
            onChange={() => toggleNotif(key)}
            label={label} desc={desc} />
        ))}
      </Section>

      {/* Security */}
      <Section title="Security settings" icon={IC.shield}>
        <Toggle
          checked={settings?.security?.twoFactor ?? true}
          onChange={() => toggleSecurity("twoFactor")}
          label="Two-factor authentication"
          desc="Add an extra layer of security to your account"
        />
        <Toggle
          checked={settings?.security?.loginAlerts ?? true}
          onChange={() => toggleSecurity("loginAlerts")}
          label="Login alerts"
          desc="Get notified of new sign-ins from unknown devices"
        />
        <hr style={styles.divider} />
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#1a1208", marginBottom: "12px" }}>
          Change password
        </p>
        <div style={{ display: "grid", gap: "10px" }}>
          <PwInput label="Current password" value={passwords.current} placeholder="Enter current password"
            onChange={(v) => setPasswords((p) => ({ ...p, current: v }))} />
          <PwInput label="New password" value={passwords.next} placeholder="Min. 6 characters"
            onChange={(v) => setPasswords((p) => ({ ...p, next: v }))} />
          <PwInput label="Confirm new password" value={passwords.confirm} placeholder="Repeat new password"
            onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))} />
          {pwError && <div style={styles.errBox}>{pwError}</div>}
        </div>
        <div style={styles.rowEnd}>
          <button onClick={changePassword} disabled={saving.password} style={styles.btnPrimary}>
            {saving.password
              ? <div style={styles.spinner} />
              : <Icon d={IC.shield} size={14} />}
            Update password
          </button>
        </div>
        <div style={styles.secureBadge}>
          <div style={styles.secureDot}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#15803d" }}>Account is secured</p>
            <p style={{ fontSize: "11px", color: "#166534", marginTop: "1px" }}>
              2FA enabled · Last login: Today, 09:41 AM
            </p>
          </div>
        </div>
      </Section>

      {/* Store Config */}
      <Section title="Store configuration" icon={IC.store}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            ["Store name", "name", settings?.store?.name || ""],
            ["Support email", "email", settings?.store?.email || ""],
            ["Support phone", "phone", settings?.store?.phone || ""],
            ["Website URL", "website", settings?.store?.website || ""],
          ].map(([label, key, val]) => (
            <div key={key}>
              <label style={styles.fieldLabel}>{label}</label>
              <input
                style={styles.input}
                defaultValue={val}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, store: { ...s.store, [key]: e.target.value } }))
                }
                onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                onBlur={(e) => (e.target.style.borderColor = "#e0d0c0")}
              />
            </div>
          ))}
          <div>
            <label style={styles.fieldLabel}>Currency</label>
            <select
              style={styles.select}
              defaultValue={settings?.store?.currency}
              onChange={(e) =>
                setSettings((s) => ({ ...s, store: { ...s.store, currency: e.target.value } }))
              }>
              {["USD", "EUR", "GBP", "CAD", "AUD", "JPY"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={styles.fieldLabel}>Tax rate (%)</label>
            <input
              style={styles.input}
              type="number"
              defaultValue={settings?.store?.taxRate}
              step="0.1" min="0" max="100"
              onChange={(e) =>
                setSettings((s) => ({ ...s, store: { ...s.store, taxRate: e.target.value } }))
              }
              onFocus={(e) => (e.target.style.borderColor = "#f97316")}
              onBlur={(e) => (e.target.style.borderColor = "#e0d0c0")}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={styles.fieldLabel}>Region</label>
            <select
              style={styles.select}
              defaultValue={settings?.store?.region}
              onChange={(e) =>
                setSettings((s) => ({ ...s, store: { ...s.store, region: e.target.value } }))
              }>
              {["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa"].map(
                (r) => <option key={r}>{r}</option>
              )}
            </select>
          </div>
        </div>
        <div style={styles.rowEnd}>
          <button onClick={() => save("store", settings.store)} disabled={saving.store}
            style={styles.btnPrimary}>
            {saving.store
              ? <div style={styles.spinner} />
              : <Icon d={IC.save} size={14} />}
            Save store settings
          </button>
        </div>
      </Section>

      {/* Danger Zone */}
      <div style={styles.dangerZone}>
        <h3 style={{ fontSize: "15px", fontWeight: 500, color: "#dc2626", marginBottom: "4px" }}>
          Danger zone
        </h3>
        <p style={{ fontSize: "12px", color: "#f87171", marginBottom: "1rem" }}>
          These actions are irreversible. Proceed with caution.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button style={styles.btnOutlineDanger}
            onClick={() => showToast("Demo: Data cleared would reset to seed data.", "error")}>
            Reset all data
          </button>
          <button style={styles.btnOutlineDanger}
            onClick={() => showToast("Demo: Export not available in demo mode.", "error")}>
            Export & delete account
          </button>
        </div>
      </div>
    </div>
  );
}