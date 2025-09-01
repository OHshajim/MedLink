import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { PatientDashboard } from "@/pages/patient/Dashboard";
import { PatientAppointments } from "@/pages/patient/Appointments";
import { DoctorDashboard } from "@/pages/doctor/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <ProtectedRoute role="PATIENT">
                                    <PatientDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/patient/dashboard"
                            element={
                                <ProtectedRoute role="PATIENT">
                                    <PatientDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/patient/appointments"
                            element={
                                <ProtectedRoute role="PATIENT">
                                    <PatientAppointments />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/doctor/dashboard"
                            element={
                                <ProtectedRoute role="DOCTOR">
                                    <DoctorDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
