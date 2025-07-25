import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { RootState } from "@/store/store";

interface ProtectedRouteProps {
    children: ReactNode;
}

const UserProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = useSelector((state: RootState) => state.userToken.userToken);
       
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default UserProtectedRoute;
