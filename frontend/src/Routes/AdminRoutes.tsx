// src/routes/AdminRoutes.tsx
import { Route, Routes } from "react-router-dom";
import AdminLogin from "@/pages/Admin/Login";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminLayout from "@/pages/Admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { UserManagement } from "@/components/admin/UserManagment";


export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/" element={<AdminLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path="users" element={<UserManagement/>} />
        </Route>
      </Route>
    </Routes>
  );
};
