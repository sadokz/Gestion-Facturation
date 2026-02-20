import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { YearProvider } from "./context/YearContext";
import { NavigationProvider } from "./context/NavigationContext";
import { DashboardProvider } from "./context/DashboardContext";
import { PrivacyProvider } from "./context/PrivacyContext";
import { CompanyProvider } from "./context/CompanyContext";
import { UserProvider } from "./context/UserContext";
import { RoleProvider } from "./context/RoleContext";
import { ViewModeProvider } from "./context/ViewModeContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/Dashboard";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
                          <DashboardLayout>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/project-tracking" element={<ProjectTracking />} />
                              <Route path="/clients" element={<Clients />} />
                              <Route path="/companies" element={<Companies />} />
                              <Route path="/purchases" element={<Purchases />} />
                              <Route path="/salaries" element={<Salaries />} />
                              <Route path="/hr" element={<HR />} />
                              <Route path="/cnss" element={<CNSS />} />
                              <Route path="/accounting" element={<Accounting />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/super-admin" element={<SuperAdmin />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </DashboardLayout>
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
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;