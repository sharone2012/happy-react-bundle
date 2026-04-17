import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// CFI Design System v3 tokens — kept local so this file has zero external style deps
const C = {
  navy: "#060C14",
  teal: "#40D7C5",
  grey: "#A8BDD0",
};

function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        zIndex: 9999,
      }}
    >
      {/* Teal pulsing ring */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `3px solid rgba(64,215,197,0.15)`,
          borderTopColor: C.teal,
          animation: "cfi-spin 0.9s linear infinite",
        }}
      />
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          letterSpacing: "0.12em",
          color: C.grey,
          textTransform: "uppercase",
        }}
      >
        Authenticating…
      </span>

      {/* Keyframe injected once — no CSS file dependency */}
      <style>{`
        @keyframes cfi-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * PrivateRoute — React Router v6 Outlet-based route guard.
 *
 * Usage in main.tsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/" element={<App />} />
 *     ...all protected routes...
 *   </Route>
 *
 * Behaviour:
 *   loading  → full-screen spinner (prevents flash-redirect on page refresh)
 *   no session → <Navigate to="/login" replace />
 *   session  → <Outlet /> (render the matched child route)
 */
export default function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}
