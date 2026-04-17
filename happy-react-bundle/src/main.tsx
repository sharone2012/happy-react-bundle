import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import AuthPage from "./auth/AuthPage";
import { MillProvider } from "./contexts/MillContext";
import GlobalLayout from "./components/GlobalLayout/GlobalLayout.jsx";
import App from "./App/App.jsx";
import LabAnalysisV2 from "./pages/LabAnalysisV2/LabAnalysisV2.jsx";
import S3Landing from "./pages/S3Landing/S3Landing.jsx";
import S3ABioLibrary from "./pages/S3ABioLibrary/S3ABioLibrary.jsx";
import S1Hub from "./pages/S1Hub/S1Hub.jsx";
import S1Efb from "./pages/S1Efb/S1Efb.jsx";
import S1Opdc from "./pages/S1Opdc/S1Opdc.jsx";
import S1EfbDetail from "./pages/S1EfbDetail/S1EfbDetail.jsx";
import S1OpdcDetail from "./pages/S1OpdcDetail/S1OpdcDetail.jsx";
import S1Pos from "./pages/S1Pos/S1Pos.jsx";
import S1Combined from "./pages/S1Combined/S1Combined.jsx";
import S1Engineering from "./pages/S1Engineering/S1Engineering.jsx";
import S1EngineeringPrint from "./pages/S1EngineeringPrint/S1EngineeringPrint.jsx";
import S1FloorPlanPrint from "./pages/S1FloorPlanPrint/S1FloorPlanPrint.jsx";
import S1Financials from "./pages/S1Financials/S1Financials.jsx";
import S0ResidueSelector from "./pages/S0ResidueSelector/S0ResidueSelector.jsx";
import CFI_AG_Management_Planning_Calculator from "./CFI_AG_Management_Planning_Calculator/CFI_AG_Management_Planning_Calculator.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
  <BrowserRouter>
    <AuthProvider>
      <MillProvider>
        <Routes>
          {/* ── Public route: login page (no auth required) ── */}
          <Route path="/login" element={<AuthPage />} />

          {/* ── All other routes require a valid session ── */}
          <Route element={<PrivateRoute />}>
            {/* Routes with global sticky nav */}
            <Route element={<GlobalLayout />}>
              <Route path="/" element={<App />} />
              <Route path="/lab" element={<LabAnalysisV2 />} />
              <Route path="/s3" element={<S3Landing />} />
              <Route path="/s3/a-bio-library" element={<S3ABioLibrary />} />

              {/* S1 routes */}
              <Route path="/s1" element={<S1Hub />} />
              <Route path="/s1/efb" element={<S1EfbDetail />} />
              <Route path="/s1/opdc" element={<S1OpdcDetail />} />
              <Route path="/s1/pos" element={<S1Pos />} />
              <Route path="/s1-combined" element={<S1Combined />} />
              <Route path="/s1-engineering" element={<S1Engineering />} />
              <Route path="/s0-residue-select" element={<S0ResidueSelector />} />
              <Route path="/s1-capex-opex" element={<S1Financials />} />

              {/* S1 redirects from old paths */}
              <Route path="/s1-index" element={<Navigate to="/s1" replace />} />
              <Route path="/S1-index" element={<Navigate to="/s1" replace />} />
              <Route path="/s1-efb-ascii" element={<Navigate to="/s1/efb" replace />} />
              <Route path="/s1-efb-spec" element={<Navigate to="/s1/efb" replace />} />
              <Route path="/s1-floor-efb" element={<Navigate to="/s1/efb" replace />} />
              <Route path="/s1-opdc-ascii" element={<Navigate to="/s1/opdc" replace />} />
              <Route path="/s1-opdc-spec" element={<Navigate to="/s1/opdc" replace />} />
              <Route path="/s1-floor-opdc" element={<Navigate to="/s1/opdc" replace />} />
              <Route path="/s1-pos-ascii" element={<Navigate to="/s1/pos" replace />} />
              <Route path="/s1-pos-spec" element={<Navigate to="/s1/pos" replace />} />
              <Route path="/s1-floor-pos" element={<Navigate to="/s1/pos" replace />} />

              <Route path="/CFI_AG_Management_Planning_Calculator" element={<CFI_AG_Management_Planning_Calculator />} />
            </Route>

            {/* Print pages: protected but outside global nav */}
            <Route path="/s1-engineering-print" element={<S1EngineeringPrint />} />
            <Route path="/s1-floor-plan-print" element={<S1FloorPlanPrint />} />
          </Route>
        </Routes>
      </MillProvider>
    </AuthProvider>
  </BrowserRouter>
  </Provider>
);
