import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getUsers } from '@/services/admin/authService';
import { HandleVendorAccess, UnbserBlock, UserBlock } from '@/services/admin/UserManagmentService';
import toast from 'react-hot-toast';
import Pagination from '../Pagination';
const IMG_URL = import.meta.env.VITE_IMAGE_URL
interface User {
  _id: string;
  email: string;
  phone: string;
  profile_image: string;
  is_blocked: boolean;
  vendor_access: boolean;
  createdAt: string;
  updatedAt: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { users, total } = await getUsers(debouncedSearch, currentPage, limit);
        if (Array.isArray(users)) {
          setUsers(users);
          setTotalUsers(total);
          setTotalPages(Math.ceil(total / limit));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [debouncedSearch, currentPage, limit]);

  const handleBlock = async (userId: string, blocked: boolean) => {
    try {
      if (!blocked) {
        await UserBlock(userId);
        toast.success('User blocked');
      } else {
        await UnbserBlock(userId);
        toast.success('User unblocked');
      }
      toggleBlock(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`User block failed: ${errorMessage}`);
    }
  };
  const handleVendorAccess = async (userId: string, vendorAccess: boolean) => {
    try {
      await HandleVendorAccess(userId, vendorAccess);
      toast.success('vendor access changed');
      toggleVendorAccess(userId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`vendor access failed: ${errorMessage}`);
    }
  };

  const toggleBlock = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user._id === userId ? { ...user, is_blocked: !user.is_blocked } : user
      )
    );
  };

  const toggleVendorAccess = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user._id === userId ? { ...user, vendor_access: !user.vendor_access } : user
      )
    );
  };



  return (
    <motion.div className="p-6 space-y-6 min-h-screen bg-black/90">
      <motion.div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor user accounts ({totalUsers} total)</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div className="bg-black/80 backdrop-blur-xl border border-black/60 shadow-2xl p-3 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/60 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div className="bg-transparent backdrop-blur-xl border border-black/60 shadow-2xl rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-white/80 text-lg font-semibold animate-pulse">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6  h-100 flex text-center justify-center text-gray-400">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-black ">
                <tr>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-400 uppercase">User</th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-400 uppercase">Created</th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-2 text-left text-sm font-medium text-gray-400 uppercase">Vendor Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="hover:bg-black/60 transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profile_image?.trim()
                            ? IMG_URL + user.profile_image.trim()
                            : 'https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg'}
                          alt={user.email}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.email}</div>
                          <div className="text-sm text-gray-400">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleBlock(user._id, user.is_blocked)}
                        className={`text-sm font-medium px-3 py-1 rounded-lg transition-all duration-200 shadow-sm ${user.is_blocked
                            ? 'bg-[#e63946]/20 text-[#e63946] hover:bg-[#e63946]/30'
                            : 'bg-green-900/30 text-green-400 hover:bg-black/60'
                          }`}
                      >
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleVendorAccess(user._id, user.vendor_access)}
                        className={`text-sm font-medium px-3 py-1 rounded-lg transition-all duration-200 shadow-sm ${user.vendor_access
                            ? 'bg-[#e63946]/20 text-[#e63946] hover:bg-[#e63946]/30'
                            : 'bg-black/60 text-gray-300 hover:bg-black/80'
                          }`}
                      >
                        {user.vendor_access ? 'True' : 'False'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.div>
  );
}
