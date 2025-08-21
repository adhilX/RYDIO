import { userLogout } from "@/services/user/authService";
import { removeUser } from "@/store/slice/user/UserSlice";
import { removeToken } from "@/store/slice/user/UserTokenSlice";
import type { RootState } from "@/store/store";
import { LogOut, User, Car, Wallet, LockKeyhole, X, Menu, Calendar } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, NavLink } from "react-router-dom";

export function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user)
  const logout = async () => {
    try {
      await userLogout()
      dispatch(removeUser());
      dispatch(removeToken());
      toast.success('Logout successful!');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
      toast.error(`Logout failed: ${errorMessage}`);
      console.error("Logout Error:", error);
    }
  };

  const links = [
    { to: 'userProfile', label: 'User Profile', icon: User },
    { to: 'userProfile/vehicles', label: 'My Vehicles', icon: Car },
    { to: 'userProfile/wallet', label: 'Wallet', icon: Wallet },
    { to: 'userProfile/my-bookings', label: 'My Bookings', icon: Calendar },
    { to: 'userProfile/incoming-bookings', label: 'Incoming Bookings', icon: Calendar },
    ...(!user?.googleVerification ? [{ to: 'userProfile/change-password', label: 'Change Password', icon: LockKeyhole }] : [])
  ];

  const isActive = (path: string) => {
    return location.pathname === `/${path}` || (path === '' && location.pathname === '/');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-lg"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
           md:sticky md:top-[88px] left-6 z-1
        w-[300px] bg-gradient-to-b from-[#232b3a] via-[#181f23] to-[#232b3a] text-white border border-white/10
        h-[calc(100vh-40px)] my-[20px] flex flex-col items-stretch justify
        rounded-2xl shadow-2xl transition-transform duration-300 ease-in-out pt-14
        ring-1 ring-[#6DA5C0]/10
      `}>

        <nav className="flex-1 flex flex-col  gap-4 px-4 py-6">
          {links.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <NavLink
                to={`/${to}`}
                key={to}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-full font-semibold text-base transition-all duration-200 group relative
                  ${active
                    ? 'bg-[#eaf6fa] dark:bg-[#1a232a] text-[#6DA5C0] shadow-lg scale-105 ring-2 ring-[#6DA5C0]'
                    : 'hover:bg-[#232b3a] hover:text-[#6DA5C0] text-gray-200'}`}
                style={{ fontFamily: 'DM Sans, Inter, sans-serif' }}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 transition-all duration-200 ${active ? 'text-[#6DA5C0] scale-110' : 'group-hover:text-[#6DA5C0]'}`} />
                <span className="flex-1 text-left tracking-wide">{label}</span>
                {active && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#6DA5C0] rounded-full shadow-lg animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-4 my-2 border-t border-white/10" />
        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3 rounded-full text-red-400 hover:bg-[#232b3a] hover:text-red-300 transition-all duration-200 font-semibold mb-6 mx-4 dashboard-sidebar-btn"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="flex-1 text-left tracking-wide">Logout</span>
        </button>
      </aside>
    </>
  );
}
