import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {  type ReactNode } from "react";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useSelector((state: RootState) => state.userToken.userToken);
  const user = useSelector((state: RootState) => state.auth.user);
  if (token && user) {
    return <Navigate to="/" replace  />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
