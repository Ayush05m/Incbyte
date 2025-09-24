import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <AuthGuard isPrivate={true}>
                  <DashboardPage />
                </AuthGuard>
              }
            />
            <Route
              path="/login"
              element={
                <AuthGuard isPrivate={false}>
                  <LoginPage />
                </AuthGuard>
              }
            />
            <Route
              path="/register"
              element={
                <AuthGuard isPrivate={false}>
                  <RegisterPage />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;