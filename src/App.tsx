import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { YearProvider } from "./context/YearContext";
import { NavigationProvider } from "./context/NavigationContext";
import { DashboardProvider } from "./context/DashboardContext";
import { PrivacyProvider } from "./context/PrivacyContext";
import { CompanyProvider } from "./context/CompanyContext";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import { ViewModeProvider } from "./context/ViewModeContext";
import { SessionProvider, useSession } from "./context/SessionContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/Dashboard";
import TechnicalDashboard from "./pages/TechnicalDashboard";
import Projects from "./pages/Projects";
import ProjectTracking from "./pages/ProjectTracking";
import Clients from "./pages/Clients";
import Companies from "./pages/Companies";
import Purchases from "./pages/Purchases";
import Salaries from "./pages/Salaries";
import HR from "./pages/HR";
import CNSS from "./pages/CNSS";
import Accounting from "./pages/Accounting";
import Settings from "./pages/Settings";
import SuperAdmin from "./pages/SuperAdmin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useSession();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  if (!session) return <Navigate to="/login" replace />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <UserProvider>
          <RoleProvider>
            <YearProvider>
              <CompanyProvider>
                <ViewModeProvider>
                  <NavigationProvider>
                    <DashboardProvider>
                      <PrivacyProvider>
                        <TooltipProvider>
                          <Toaster />
                          <Sonner position="top-right" expand={false} richColors />
                          <BrowserRouter>
                            <Routes>
                              <Route path="/login" element={<Login />} />
                              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                              <Route path="/technical-dashboard" element={<ProtectedRoute><TechnicalDashboard /></ProtectedRoute>} />
                              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                              <Route path="/project-tracking" element={<ProtectedRoute><ProjectTracking /></ProtectedRoute>} />
                              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
                              <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                              <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
                              <Route path="/salaries" element={<ProtectedRoute><Salaries /></ProtectedRoute>} />
                              <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
                              <Route path="/cnss" element={<ProtectedRoute><CNSS /></ProtectedRoute>} />
                              <Route path="/accounting" element={<ProtectedRoute><Accounting /></ProtectedRoute>} />
                              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                              <Route path="/super-admin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </BrowserRouter>
                        </TooltipProvider>
                      </PrivacyProvider>
                    </DashboardProvider>
                  </NavigationProvider>
                </ViewModeProvider>
              </CompanyProvider>
            </YearProvider>
          </RoleProvider>
        </UserProvider>
      </SessionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;