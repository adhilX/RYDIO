// src/routes/ProtectedRoutes/AdminProtectedRoute.tsx

import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const token = useSelector((state: RootState) => state.adminToken.token);
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
