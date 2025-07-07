// src/routes/AdminRoutes.tsx
import { Route, Routes } from "react-router-dom";
import AdminLogin from "@/pages/Admin/Login";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminLayout from "@/pages/Admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { UserManagement } from "@/components/admin/UserManagment";
import VehicleList from "@/components/admin/vehicleList";
import RequestedVehiclesPage from "@/components/admin/RequestedVehicle";
import IdproofRequest from "@/components/admin/IdproofRequest";


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
          <Route path="vehicle" element={<><VehicleList/></>} />
          <Route path="vehicle_requests" element={<><RequestedVehiclesPage/></>} />
          <Route path="idproof-requests" element={<><IdproofRequest/></>} />
        </Route>
      </Route>
    </Routes>
  );
};
