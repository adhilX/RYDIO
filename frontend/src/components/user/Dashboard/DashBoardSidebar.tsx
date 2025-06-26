import { removeUser } from "@/store/slice/user/UserSlice";
import { removeToken } from "@/store/slice/user/UserTokenSlice";
import { LogOut, User, Car, Wallet, Calendar, LockKeyhole, X, Menu } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const logout = async() => {
    try {
      dispatch(removeUser());
      dispatch(removeToken());
      toast.success('Logout successful');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
      toast.error(`Logout failed: ${errorMessage}`);
      console.error("Logout Error:", error);
      throw error;
    }
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
        fixed md:sticky md:top-16 left-0 z-30
        w-64 bg-white/10 backdrop-blur-md border-r border-white/20
        h-[calc(100vh-4rem)] p-4 pt-20 flex flex-col justify-between
        transition-transform duration-300 ease-in-out
      `}>
        <nav className="space-y-2">
          <NavLink 
            to="" 
            className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <User className="w-5 h-5" />
            <span>User Profile</span>
          </NavLink>
          <NavLink 
            to="vehicles" 
            className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <Car className="w-5 h-5" />
            <span>My Vehicles</span>
          </NavLink>
          <NavLink 
            to="wallet" 
            className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <Wallet className="w-5 h-5" />
            <span>Wallet</span>
          </NavLink>
          <NavLink 
            to="bookings" 
            className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <Calendar className="w-5 h-5" />
            <span>My Bookings</span>
          </NavLink>
          <NavLink 
            to="changepassword" 
            className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            onClick={() => setIsMobileOpen(false)}
          >
            <LockKeyhole className="w-5 h-5" />
            <span>Change Password</span>
          </NavLink>
        </nav>
      
        <button 
          onClick={logout} 
          className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-white/10 hover:text-red-300 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}