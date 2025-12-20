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
        fixed md:relative md:left-0 z-30
        w-[300px] md:w-[320px] bg-black/40 backdrop-blur-xl text-white border border-white/10
        h-[calc(100vh-120px)] md:h-full flex flex-col items-stretch justify-between
        rounded-2xl shadow-xl transition-transform duration-300 ease-in-out
        mt-20 md:mt-0 md:mr-6 shrink-0
      `}>

        <nav className="flex-1 flex flex-col gap-3 px-4 py-6 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <NavLink
                to={`/${to}`}
                key={to}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-300 group relative flex-shrink-0
                  ${active
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-[1.02]'
                    : 'hover:bg-white/10 text-gray-400 hover:text-white hover:pl-6'}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${active ? 'text-black' : 'group-hover:text-white'}`} />
                <span className="flex-1 text-left tracking-wide">{label}</span>
                {active && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="mx-4 my-2 border-t border-white/10" />
        <button
          onClick={logout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-white/5 hover:text-red-400 transition-all duration-200 font-medium mb-6 mx-4"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left tracking-wide">Logout</span>
        </button>
      </aside>
    </>
  );
}
