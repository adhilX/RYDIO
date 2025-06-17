import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';

export function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

return (
    <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
        </motion.div>

        {/* <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'blue' },
                { title: 'Active Sessions', value: '1,234', change: '+8%', icon: Activity, color: 'green' },
                { title: 'Revenue', value: '$12,543', change: '+23%', icon: DollarSign, color: 'purple' },
                { title: 'Growth', value: '34.5%', change: '+5%', icon: TrendingUp, color: 'orange' }
            ].map((stat, index) => (
                <motion.div
                    key={stat.title}
                    className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">{stat.title}</p>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            <p className="text-sm text-green-400 mt-1">{stat.change}</p>
                        </div>
                        <div
                            className={`
                                w-12 h-12 rounded-xl 
                                ${stat.color === 'blue' ? 'bg-blue-900/20' : ''}
                                ${stat.color === 'green' ? 'bg-green-900/20' : ''}
                                ${stat.color === 'purple' ? 'bg-purple-900/20' : ''}
                                ${stat.color === 'orange' ? 'bg-orange-900/20' : ''}
                                flex items-center justify-center
                            `}
                        >
                            <stat.icon
                                className={`
                                    w-6 h-6
                                    ${stat.color === 'blue' ? 'text-blue-400' : ''}
                                    ${stat.color === 'green' ? 'text-green-400' : ''}
                                    ${stat.color === 'purple' ? 'text-purple-400' : ''}
                                    ${stat.color === 'orange' ? 'text-orange-400' : ''}
                                `}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {[
                    'New user registration: john@example.com',
                    'System backup completed successfully',
                    'Payment processed: $299.99',
                    'Security scan completed'
                ].map((activity, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <p className="text-sm text-gray-300">{activity}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div> */}
    </motion.div>
);
}
