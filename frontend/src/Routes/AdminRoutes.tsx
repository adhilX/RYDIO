// src/routes/AdminRoutes.tsx
import { Route, Routes } from "react-router-dom";
import AdminLogin from "@/pages/Admin/Login";
import AdminLayout from "@/layout/admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";
import { UserManagement } from "@/components/admin/UserManagment";
import VehicleList from "@/components/admin/vehicleList";
import RequestedVehiclesPage from "@/components/admin/RequestedVehicle";
import IdproofRequest from "@/components/admin/IdproofRequest";
import BookingList from "@/components/admin/BookingList";
import WalletManagement from "@/components/admin/WalletManagement";
import TokenProtected from "./ProtectedRoutes/tokenProtected";

export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route element={<TokenProtected isAdmin={true} children={<AdminLayout/>} />}>
          <Route index element={<Dashboard/>} />
          <Route path="users" element={<UserManagement/>} />
          <Route path="vehicle" element={<><VehicleList/></>} />
          <Route path="vehicle_requests" element={<><RequestedVehiclesPage/></>} />
          <Route path="idproof-requests" element={<><IdproofRequest/></>} />
          <Route path="bookings" element={<><BookingList/></>} />
          <Route path="wallet" element={<><WalletManagement/></>} />
      </Route>
    </Routes>
  );
};
