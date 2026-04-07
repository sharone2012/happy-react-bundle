import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const S = {
  bg: "#060C14",
  card: "#0D2137",
  border: "#1E6B8C",
  teal: "#00C9B1",
  white: "#FFFFFF",
  grey: "#8BA0B4",
  inputBg: "#1A3A5C",
  blackInner: "#060C14",
  errorBg: "#1A0000",
  errorBorder: "#FF4444",
};

export default function LoginPage({ onLoginSuccess }) {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginCode, setLoginCode] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regCode, setRegCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });
      if (err) throw err;
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (regPass !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signUp({
        email: regEmail,
        password: regPass,
        options: { data: { full_name: regName, access_code: regCode } },
      });
      if (err) throw err;
      onLoginSuccess?.();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (err) setError(err.message);
  };

  const inputStyle = (black) => ({
    width: "100%",
    height: 38,
    background: black ? S.blackInner : S.inputBg,
    border: `1px solid ${S.border}`,
    borderRadius: 4,
    color: S.white,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    padding: "0 12px",
    outline: "none",
    boxSizing: "border-box",
  });

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 11,
    color: S.teal,
    marginBottom: 4,
    display: "block",
  };

  const fieldGap = { marginBottom: 14 };

  const ctaStyle = {
    width: "100%",
    height: 42,
    background: S.teal,
    border: "none",
    borderRadius: 4,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: S.blackInner,
    cursor: "pointer",
    marginTop: 16,
  };

  const googleStyle = {
    width: "100%",
    height: 38,
    background: "transparent",
    border: `1px solid ${S.border}`,
    borderRadius: 4,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 12,
    color: S.white,
    cursor: "pointer",
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  const tabBtn = (active) => ({
    background: "none",
    border: "none",
    borderBottom: active ? `2px solid ${S.teal}` : "2px solid transparent",
    color: active ? S.white : S.grey,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: 12,
    padding: "8px 20px",
    cursor: "pointer",
  });

  return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 420, width: "100%", background: S.card, border: `1.5px solid ${S.border}`, borderRadius: 8, padding: "40px 36px" }}>

        {/* Brand */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'EB Garamond', serif", fontWeight: 700, fontSize: 18, color: S.white, letterSpacing: 2 }}>
            CIRCULAR FERTILISER INDUSTRIES
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11, color: S.grey, marginTop: 4 }}>
            CFI Platform
          </div>
        </div>
        <div style={{ height: 1, background: S.border, margin: "20px 0" }} />

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 20 }}>
          <button style={tabBtn(tab === "login")} onClick={() => { setTab("login"); setError(""); }}>Login</button>
          <button style={tabBtn(tab === "register")} onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: S.errorBg, border: `1px solid ${S.errorBorder}`, borderRadius: 4, padding: "8px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: S.errorBorder, marginBottom: 14 }}>
            {error}
          </div>
        )}

        {/* LOGIN TAB */}
        {tab === "login" && (
          <form onSubmit={handleLogin}>
            <div style={fieldGap}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Password</label>
              <input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Access Code (Optional)</label>
              <input type="text" value={loginCode} onChange={(e) => setLoginCode(e.target.value)} style={inputStyle(true)} placeholder="Leave blank if not required" />
            </div>
            <button type="submit" disabled={loading} style={{ ...ctaStyle, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Authenticating..." : "Login To Platform"}
            </button>
            <button type="button" onClick={handleGoogle} style={googleStyle}>
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.4 0-9.9-3.5-11.5-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/></svg>
              Continue with Google
            </button>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11, color: S.grey, cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>
          </form>
        )}

        {/* REGISTER TAB */}
        {tab === "register" && (
          <form onSubmit={handleRegister}>
            <div style={fieldGap}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Password</label>
              <input type="password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" required value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} style={inputStyle(false)} />
            </div>
            <div style={fieldGap}>
              <label style={labelStyle}>Access Code</label>
              <input type="text" value={regCode} onChange={(e) => setRegCode(e.target.value)} style={inputStyle(true)} placeholder="Enter access code provided by CFI admin" />
            </div>
            <button type="submit" disabled={loading} style={{ ...ctaStyle, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Authenticating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}