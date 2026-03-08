import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useHealthData } from "@/hooks/useHealthData";
import { useDevice } from "@/hooks/useDevice";
import { AppLayout } from "@/components/AppLayout";
import AuthPage from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import HomePage from "@/pages/Home";
import StressPage from "@/pages/Stress";
import HeartPage from "@/pages/Heart";
import SleepPage from "@/pages/Sleep";
import GesturesPage from "@/pages/Gestures";
import FindPage from "@/pages/Find";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { useUserStore } from "@/store";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();
  const profile = useUserStore((s) => s.profile);

  useHealthData(user);
  useDevice(user);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <AuthPage />;
  if (profile && !profile.onboarding_done) return <Onboarding />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/"         element={<HomePage />} />
        <Route path="/stress"   element={<StressPage />} />
        <Route path="/heart"    element={<HeartPage />} />
        <Route path="/sleep"    element={<SleepPage />} />
        <Route path="/gestures" element={<GesturesPage />} />
        <Route path="/find"     element={<FindPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
