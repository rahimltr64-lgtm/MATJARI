import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar, Footer } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { CreateStorePage } from "./pages/CreateStorePage";
import { LoginPage } from "./pages/LoginPage";
import { PaymentPage } from "./pages/PaymentPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StorefrontPage, DemoStorePage } from "./pages/StorefrontPage";
import { AdminPage } from "./pages/AdminPage";

function AppContent() {
  const location = useLocation();
  const isStorePage = location.pathname.startsWith("/store/");

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {!isStorePage && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateStorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/payment/:storeId" element={<PaymentPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/store/:slug" element={<StorefrontPage />} />
        <Route path="/demo-store" element={<DemoStorePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isStorePage && <Footer />}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "rgba(24, 24, 27, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "white",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
