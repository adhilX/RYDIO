import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getUsers } from '@/services/admin/authService';
import { UnbserBlock, UserBlock } from '@/services/admin/UserBlockService';
import toast from 'react-hot-toast';
import { PuffLoader } from 'react-spinners';

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
      setCurrentPage(1); // reset page on new search
    }, 1500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch users
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div className="p-6 space-y-6 bg-black min-h-screen">
      <motion.div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor user accounts ({totalUsers} total)</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div className="bg-black p-3 rounded-xl border border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div className="bg-black rounded-xl border border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-max">
            <PuffLoader color="#ffffff" size={60} />
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
                    className="hover:bg-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profile_image?.trim() || 'https://cdn.vectorstock.com/i/preview-1x/17/61/male-avatar-profile-picture-vector-10211761.jpg'}
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
                        className={`text-sm font-medium px-3 py-1 rounded-lg ${
                          user.is_blocked
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                        }`}
                      >
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleVendorAccess(user._id)}
                        className={`text-sm font-medium px-3 py-1 rounded-lg ${
                          user.vendor_access
                            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
        <motion.div
          className="flex items-center justify-center bg-dark p-4 rounded-xl border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
