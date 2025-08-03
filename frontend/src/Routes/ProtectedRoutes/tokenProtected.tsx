import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { RootState } from "@/store/store";


interface ProtectedRouteProps {
    isAdmin?: boolean;
    children: ReactNode;
}


const TokenProtected: React.FC<ProtectedRouteProps> = ({ children, isAdmin = false }) => {
    const token = useSelector((state: RootState) =>
      isAdmin ? state.adminToken.adminToken : state.userToken.userToken
    );
  
    if (!token) {
      return <Navigate to={isAdmin ? "/admin/login" : "/login"} replace />;
    }
  
    return <>{children}</>;
  };

export default TokenProtected;
