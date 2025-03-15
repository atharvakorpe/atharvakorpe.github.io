
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ParkingProvider } from "@/contexts/ParkingContext";

// Pages
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Security pages
import RequestEntry from "./pages/security/RequestEntry";

// Admin pages
import Approvals from "./pages/admin/Approvals";

// Superuser pages
import OverstayVehicles from "./pages/superuser/OverstayVehicles";
import PendingApprovals from "./pages/superuser/PendingApprovals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ParkingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              
              {/* Security Routes */}
              <Route path="/request" element={<RequestEntry />} />
              
              {/* Admin Routes */}
              <Route path="/approvals" element={<Approvals />} />
              
              {/* Superuser Routes */}
              <Route path="/overstay" element={<OverstayVehicles />} />
              <Route path="/approvals" element={<PendingApprovals />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ParkingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
