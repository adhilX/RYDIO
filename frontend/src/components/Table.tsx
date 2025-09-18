import { motion } from 'framer-motion'
import type { User } from './admin/UserManagment'
const IMG_URL = import.meta.env.VITE_IMAGE_URL

function Table({heading,users,handleVendorAccess,handleBlock}:{heading:string[],users:User[],handleVendorAccess:(userId:string,vendorAccess:boolean)=>void,handleBlock:(userId:string,blocked:boolean)=>void}) {
  return (

    <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead className="bg-black ">
        <tr>
          {heading.map((head:string,index:number)=>(
          <th key={index} className="px-6 py-2 text-left text-sm font-medium text-gray-400 uppercase">{head}</th>
        ))}
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

  )
}

export default Table