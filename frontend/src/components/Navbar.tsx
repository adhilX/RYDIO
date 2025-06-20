import { Link } from 'react-router-dom' 
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { removeUser } from '@/store/slice/user/UserSlice';
import { removeToken } from '@/store/slice/user/UserTokenSlice';
// import { userLogout } from '@/services/user/authService';
import toast from 'react-hot-toast';

function Navbar({setIsMenuOpen,isMenuOpen,}: { setIsMenuOpen: (isOpen: boolean) => void; isMenuOpen: boolean}) {
  const token = useSelector((state: RootState) => state.userToken.token);
const dispatch =useDispatch()

   const logout = async()=>{
    try {
      // await userLogout()
      dispatch(removeUser())
      dispatch(removeToken())
      toast.success('logout success')
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred"
        toast.error(`logout failed: ${errorMessage}`)
        console.error("logout Error:", error)
        throw error;
    }
  }
  return (
    <nav className="relative z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white tracking-wider">
              RY<span className="text-red-700">DIO</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link to="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
            <Link to="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div>

              <Link to="#">
                <Button onClick={logout} className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white">
                  Logout
                </Button>

              </Link>
              <Link to={'/userprofile'}>
              <Button className='bg-cyan-900'>
                  profile
                </Button>
              </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link to="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link to="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
              <Link to="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link to="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              {token ? (
                <Link to="#">
                  <Button  onClick={logout} className="w-full bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white">
                    Logout
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full text-gray-300 hover:text-white hover:bg-gray-800">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
