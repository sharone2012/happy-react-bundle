import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import LabAnalysis from "./pages/LabAnalysis.jsx";
import S3Landing from "./pages/S3Landing.jsx";
import S3ABioLibrary from "./pages/S3ABioLibrary.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lab" element={<LabAnalysis />} />
      <Route path="/s3" element={<S3Landing />} />
      <Route path="/s3/a-bio-library" element={<S3ABioLibrary />} />
    </Routes>
  </BrowserRouter>
);
