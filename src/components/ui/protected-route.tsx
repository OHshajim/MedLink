import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
    role?: "DOCTOR" | "PATIENT";
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // 1️⃣ Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2️⃣ Role mismatch
    if (role && user?.role !== role) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Authenticated and role matches (or no role restriction)
    return <>{children}</>;
};
