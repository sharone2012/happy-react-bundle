import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ─── Global CSS (injected via <style> tag) ────────────────────────────────────
// Handles: browser autofill override, class-based styles, keyframes
const GLOBAL_STYLES = `
  @keyframes cfi-spin   { to { transform: rotate(360deg); } }
  @keyframes cfi-fadeup { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes cfi-pulse  { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes cfi-glow   { 0%,100% { box-shadow: 0 0 20px rgba(64,215,197,0.06); } 50% { box-shadow: 0 0 40px rgba(64,215,197,0.12); } }
  @keyframes cfi-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes cfi-float {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-4px); }
  }

  /* ── Kill the browser's autofill white-box override ── */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 60px #0A1624 inset !important;
    -webkit-text-fill-color: #FFFFFF !important;
    transition: background-color 9999s ease-in-out 0s;
    caret-color: #FFFFFF;
  }

  /* ── Input ── */
  .cfi-input {
    width: 100%;
    height: 46px;
    background: rgba(10,22,36,0.80);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(168,189,208,0.10);
    border-radius: 8px;
    color: #FFFFFF;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 0 42px 0 14px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s ease;
  }
  .cfi-input:focus {
    border-color: rgba(64,215,197,0.55);
    box-shadow: 0 0 0 3px rgba(64,215,197,0.08), 0 0 20px rgba(64,215,197,0.06);
    background: rgba(10,22,36,0.95);
  }
  .cfi-input::placeholder { color: rgba(168,189,208,0.24); }
  .cfi-input:disabled     { opacity: 0.40; cursor: not-allowed; }
  .cfi-input-plain { padding-right: 14px; }

  /* ── Tab buttons ── */
  .cfi-tab {
    flex: 1;
    height: 42px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: rgba(168,189,208,0.42);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: color 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1);
    padding: 0;
    position: relative;
  }
  .cfi-tab.active {
    color: #40D7C5;
    border-bottom-color: #40D7C5;
    text-shadow: 0 0 20px rgba(64,215,197,0.3);
  }
  .cfi-tab:hover:not(.active) { color: rgba(168,189,208,0.72); }

  /* ── Primary button ── */
  .cfi-btn-primary {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #40D7C5 0%, #2BC4B4 100%);
    border: none;
    border-radius: 8px;
    color: #060C14;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.08em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .cfi-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .cfi-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(64,215,197,0.28), 0 0 0 1px rgba(64,215,197,0.15);
  }
  .cfi-btn-primary:hover:not(:disabled)::before {
    opacity: 1;
    animation: cfi-shimmer 1.5s ease infinite;
  }
  .cfi-btn-primary:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
    box-shadow: 0 2px 8px rgba(64,215,197,0.15);
  }
  .cfi-btn-primary:disabled {
    background: rgba(64,215,197,0.18);
    color: rgba(6,12,20,0.45);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* ── Google button ── */
  .cfi-btn-google {
    width: 100%;
    height: 46px;
    background: rgba(168,189,208,0.03);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(168,189,208,0.10);
    border-radius: 8px;
    color: #A8BDD0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .cfi-btn-google:hover:not(:disabled) {
    background: rgba(168,189,208,0.07);
    border-color: rgba(168,189,208,0.22);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }
  .cfi-btn-google:active:not(:disabled) { transform: translateY(0); }
  .cfi-btn-google:disabled { opacity: 0.38; cursor: not-allowed; }

  /* ── Feedback banners ── */
  .cfi-banner {
    border-radius: 8px;
    padding: 11px 14px;
    margin-bottom: 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 9px;
    animation: cfi-fadeup 0.3s cubic-bezier(0.4,0,0.2,1);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  .cfi-banner.error   { background:rgba(232,64,64,0.08);  border:1px solid rgba(232,64,64,0.22);  color:#F07878; }
  .cfi-banner.success { background:rgba(0,162,73,0.08);   border:1px solid rgba(0,162,73,0.22);   color:#3DD68C; }

  /* ── Card entrance ── */
  .cfi-card {
    animation: cfi-fadeup 0.45s cubic-bezier(0.16,1,0.3,1);
    animation-fill-mode: both;
  }

  /* ── Eye toggle ── */
  .cfi-eye { position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; padding:3px;
    color:rgba(168,189,208,0.35); line-height:0; transition:color 0.2s ease, transform 0.2s ease; }
  .cfi-eye:hover { color:rgba(168,189,208,0.70); transform: translateY(-50%) scale(1.1); }

  /* ── Smooth form field transitions ── */
  .cfi-field-group {
    animation: cfi-fadeup 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }
  .cfi-field-group:nth-child(1) { animation-delay: 0.04s; }
  .cfi-field-group:nth-child(2) { animation-delay: 0.08s; }
  .cfi-field-group:nth-child(3) { animation-delay: 0.12s; }
  .cfi-field-group:nth-child(4) { animation-delay: 0.16s; }
  .cfi-field-group:nth-child(5) { animation-delay: 0.20s; }
`;

// ─── Design tokens ────────────────────────────────────────────────────────────
const F = { syne: "'Syne', sans-serif", dm: "'DM Sans', sans-serif" };

// ─── Primitives ───────────────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: F.syne, fontWeight: 600, fontSize: 10,
      letterSpacing: "0.11em", textTransform: "uppercase",
      color: "#40D7C5", marginBottom: 7,
    }}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="cfi-field-group" style={{ marginBottom: 20 }}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

function TextInput({ type = "text", value, onChange, placeholder, disabled, autoComplete }) {
  return (
    <input
      className="cfi-input cfi-input-plain"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
    />
  );
}

function PasswordInput({ value, onChange, placeholder, disabled, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        className="cfi-input"
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="cfi-eye"
        onClick={() => setVisible(v => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

function BtnSpinner() {
  return (
    <div style={{
      width: 15, height: 15, flexShrink: 0,
      border: "2px solid rgba(6,12,20,0.25)",
      borderTopColor: "#060C14",
      borderRadius: "50%",
      animation: "cfi-spin 0.75s linear infinite",
      display: "inline-block",
    }} />
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="cfi-banner error">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>{message}</span>
    </div>
  );
}

function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="cfi-banner success">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>{message}</span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(168,189,208,0.10), transparent)" }} />
      <span style={{ fontFamily: F.dm, fontSize: 10, color: "rgba(168,189,208,0.24)", letterSpacing: "0.10em", fontWeight: 500 }}>OR</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(168,189,208,0.10), transparent)" }} />
    </div>
  );
}

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
);

// ─── Sign-In Form ─────────────────────────────────────────────────────────────
function SignInForm({ onError }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) { onError("Please enter your email and password."); return; }
    onError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      // Session change handled by AuthContext → AuthPage useEffect will navigate to "/"
    } catch (err) {
      onError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    onError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) onError(error.message);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Email Address">
        <TextInput
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="engineer@cfideeptech.com" disabled={loading} autoComplete="email"
        />
      </Field>
      <Field label="Password">
        <PasswordInput
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password" disabled={loading} autoComplete="current-password"
        />
      </Field>

      <button className="cfi-btn-primary" type="submit" disabled={loading}>
        {loading ? <><BtnSpinner /><span>Signing in…</span></> : "Sign In"}
      </button>

      <Divider />

      <button className="cfi-btn-google" type="button" onClick={handleGoogle} disabled={loading}>
        {GOOGLE_ICON}
        Continue with Google
      </button>
    </form>
  );
}

// ─── Sign-Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({ onError, onSuccess }) {
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading,    setLoading]    = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    onError(""); onSuccess("");
    if (password !== confirm) { onError("Passwords do not match."); return; }
    if (password.length < 8)  { onError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), access_code: accessCode.trim() } },
      });
      if (error) throw error;
      onSuccess("Account created — check your email to confirm before signing in.");
    } catch (err) {
      onError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && fullName && email && password && confirm && accessCode;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Full Name">
        <TextInput value={fullName} onChange={e => setFullName(e.target.value)}
          placeholder="Your full name" disabled={loading} autoComplete="name" />
      </Field>
      <Field label="Email Address">
        <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="engineer@cfideeptech.com" disabled={loading} autoComplete="email" />
      </Field>
      <Field label="Password">
        <PasswordInput value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Min. 8 characters" disabled={loading} autoComplete="new-password" />
      </Field>
      <Field label="Confirm Password">
        <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Re-enter password" disabled={loading} autoComplete="new-password" />
      </Field>
      <Field label="Access Code">
        <TextInput value={accessCode} onChange={e => setAccessCode(e.target.value)}
          placeholder="CFI-issued access code" disabled={loading} autoComplete="off" />
      </Field>

      <button className="cfi-btn-primary" type="submit" disabled={!canSubmit}>
        {loading ? <><BtnSpinner /><span>Creating account…</span></> : "Create Account"}
      </button>
    </form>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function CFILogo() {
  return (
    <div style={{ textAlign: "center", marginBottom: 36 }}>
      {/* Icon mark */}
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 58, height: 58,
        background: "linear-gradient(135deg, rgba(64,215,197,0.14) 0%, rgba(64,215,197,0.04) 100%)",
        border: "1.5px solid rgba(64,215,197,0.35)",
        borderRadius: 16, marginBottom: 18,
        boxShadow: "0 0 30px rgba(64,215,197,0.10), inset 0 1px 0 rgba(255,255,255,0.03)",
        animation: "cfi-float 4s ease-in-out infinite",
      }}>
        <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#40D7C5" strokeWidth="1.5" fill="none"/>
          <path d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z" fill="#40D7C5" fillOpacity="0.12"/>
          <circle cx="14" cy="14" r="3.5" fill="#40D7C5"/>
        </svg>
      </div>

      <div style={{ fontFamily: F.syne, fontWeight: 700, fontSize: 20,
                    letterSpacing: "0.08em", color: "#FFFFFF", lineHeight: 1 }}>
        CFI DEEP TECH
      </div>
      <div style={{ fontFamily: F.dm, fontSize: 11.5, color: "rgba(168,189,208,0.50)",
                    marginTop: 9, letterSpacing: "0.06em" }}>
        Circular Nutrient Recovery Platform
      </div>
    </div>
  );
}

// ─── AuthPage ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const { session } = useAuth();
  const navigate    = useNavigate();

  const [tab,     setTab]     = useState("signin");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // Redirect already-authenticated users
  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  function switchTab(t) {
    setTab(t);
    setError("");
    setSuccess("");
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* Page wrapper — layered radial glows for depth */}
      <div style={{
        minHeight: "100dvh",
        background: `
          radial-gradient(ellipse 60% 30% at 50% -5%, rgba(64,215,197,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 90%, rgba(64,215,197,0.03) 0%, transparent 50%),
          radial-gradient(ellipse 30% 30% at 10% 80%, rgba(245,166,35,0.02) 0%, transparent 50%),
          #060C14
        `,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 16px 44px",
        fontFamily: F.dm,
      }}>

        {/* Auth card — glassmorphic deeptech panel */}
        <div className="cfi-card" style={{
          width: "100%",
          maxWidth: 462,
          background: "rgba(13,25,39,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(64,215,197,0.08)",
          borderRadius: 16,
          padding: "42px 40px 48px",
          boxShadow: `
            0 0 0 1px rgba(64,215,197,0.04),
            0 1px 2px rgba(0,0,0,0.3),
            0 8px 16px rgba(0,0,0,0.3),
            0 40px 80px rgba(0,0,0,0.5)
          `,
          animation: "cfi-glow 6s ease-in-out infinite",
        }}>
          <CFILogo />

          {/* Tab bar — underline indicator style */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid rgba(168,189,208,0.09)",
            marginBottom: 28,
          }}>
            <button className={`cfi-tab${tab === "signin" ? " active" : ""}`}
              type="button" onClick={() => switchTab("signin")}>
              Sign In
            </button>
            <button className={`cfi-tab${tab === "signup" ? " active" : ""}`}
              type="button" onClick={() => switchTab("signup")}>
              Create Account
            </button>
          </div>

          <ErrorBanner   message={error}   />
          <SuccessBanner message={success} />

          {tab === "signin"
            ? <SignInForm onError={setError} />
            : <SignUpForm onError={setError} onSuccess={setSuccess} />
          }
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 32,
          fontFamily: F.dm,
          fontSize: 11,
          color: "rgba(168,189,208,0.22)",
          letterSpacing: "0.05em",
          textAlign: "center",
          lineHeight: 1.85,
        }}>
          CFI Deep Tech &middot; Circular Nutrient Recovery Platform
          <br />
          Access is restricted to authorised personnel only.
        </div>
      </div>
    </>
  );
}
