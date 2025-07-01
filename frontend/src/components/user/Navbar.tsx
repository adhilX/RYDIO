
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
;
// import { userLogout } from '@/services/user/authService';
import { Bell, Car, Heart, User } from 'lucide-react';
import { Link } from 'react-router';

function Navbar() {
  const token = useSelector((state: RootState) => state.userToken.token);


  return (
      <header className="absolute top-0 w-screen z-50 p-6 ">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center mr-15 space-x-2">
            <Car className="text-white animate-bounce" size={32} />
            <span className="text-2xl font-bold text-white">RYDIO</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative" title="Notifications">
                    <Bell size={20} className="text-white" />
                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" title="Favorites">
                    <Heart size={20} className="text-white" />
                  </button>
                  <Link to="/userProfile">
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" title="Profile">
                      <User size={20} className="text-white" />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <p className="text-white hover:underline">Signup</p>
                  </Link>
                  <Link to="/login">
                    <p className="text-white hover:underline">Login</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>
  );
}

export default Navbar;
