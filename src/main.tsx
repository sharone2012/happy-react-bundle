import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LabAnalysis from "./pages/LabAnalysis.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lab" element={<LabAnalysis />} />
    </Routes>
  </BrowserRouter>
);
