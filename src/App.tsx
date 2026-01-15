import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Overview from "./pages/Overview";
import ClusterManagement from "./pages/ClusterManagement";
import Incentive from "./pages/Incentive";
import Onboarding from "./pages/Onboarding";
import FormularioTotais from "./pages/FormularioTotais";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analise" element={<Navigate to="/" replace />} />
            <Route path="/clusters" element={<ClusterManagement />} />
            <Route path="/incentivo" element={<Incentive />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/formulario-totais" element={<FormularioTotais />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
