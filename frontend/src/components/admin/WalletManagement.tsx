import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/Pagination';

// Dummy transaction data
const dummyTransactions = [
  {
    id: 'TXN001',
    type: 'credit',
    amount: 2500.00,
    description: 'Commission from Vehicle Booking #VB2024001',
    date: '2024-08-03T10:30:00Z',
    status: 'completed',
    category: 'commission'
  },
  {
    id: 'TXN002',
    type: 'debit',
    amount: 150.00,
    description: 'Platform Maintenance Fee',
    date: '2024-08-03T09:15:00Z',
    status: 'completed',
    category: 'fee'
  },
  {
    id: 'TXN003',
    type: 'credit',
    amount: 1800.00,
    description: 'Commission from Vehicle Booking #VB2024002',
    date: '2024-08-02T16:45:00Z',
    status: 'completed',
    category: 'commission'
  },
  {
    id: 'TXN004',
    type: 'credit',
    amount: 3200.00,
    description: 'Premium Subscription Revenue',
    date: '2024-08-02T14:20:00Z',
    status: 'completed',
    category: 'subscription'
  },
  {
    id: 'TXN005',
    type: 'debit',
    amount: 500.00,
    description: 'Refund to User #U2024015',
    date: '2024-08-02T11:30:00Z',
    status: 'completed',
    category: 'refund'
  },
  {
    id: 'TXN006',
    type: 'credit',
    amount: 4500.00,
    description: 'Commission from Vehicle Booking #VB2024003',
    date: '2024-08-01T18:00:00Z',
    status: 'completed',
    category: 'commission'
  },
  {
    id: 'TXN007',
    type: 'debit',
    amount: 200.00,
    description: 'Payment Gateway Charges',
    date: '2024-08-01T15:45:00Z',
    status: 'completed',
    category: 'fee'
  },
  {
    id: 'TXN008',
    type: 'credit',
    amount: 2100.00,
    description: 'Late Fee Collection',
    date: '2024-08-01T12:15:00Z',
    status: 'completed',
    category: 'fee'
  }
];

type TransactionType = 'all' | 'credit' | 'debit';
type TransactionCategory = 'all' | 'commission' | 'fee' | 'subscription' | 'refund';

function WalletManagement() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [filterType, setFilterType] = useState<TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  // Calculate totals
  const totalBalance = 45750.00;
  const totalCredits = dummyTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = dummyTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = dummyTransactions.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.type === filterType;
    const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilterType?: TransactionType, newFilterCategory?: TransactionCategory) => {
    if (newFilterType !== undefined) setFilterType(newFilterType);
    if (newFilterCategory !== undefined) setFilterCategory(newFilterCategory);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

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

  const cardHoverVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="p-6 space-y-6 min-h-screen bg-black/90"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-red-500" />
            Wallet Management
          </h1>
          <p className="text-gray-400 mt-1">Monitor your platform earnings and transactions</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-black/80 border-black/60 text-white hover:bg-black/60 backdrop-blur-xl"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-black/80 border-black/60 text-white hover:bg-black/60 backdrop-blur-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Balance Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <motion.div variants={cardHoverVariants} whileHover="hover">
          <Card className="bg-gradient-to-br from-red-600/50 to-red-800/50 border-red-500/50 text-white backdrop-blur-xl shadow-2xl shadow-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Balance</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <DollarSign className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {balanceVisible ? formatCurrency(totalBalance) : '••••••••'}
              </div>
              <p className="text-xs opacity-80 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Credits */}
        <motion.div variants={cardHoverVariants} whileHover="hover">
          <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 shadow-2xl shadow-red-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Credits</CardTitle>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {balanceVisible ? formatCurrency(totalCredits) : '••••••••'}
              </div>
              <p className="text-xs text-green-400 mt-1">
                +8 transactions this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Debits */}
        <motion.div variants={cardHoverVariants} whileHover="hover">
          <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 shadow-2xl shadow-red-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Debits</CardTitle>
              <ArrowDownLeft className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {balanceVisible ? formatCurrency(totalDebits) : '••••••••'}
              </div>
              <p className="text-xs text-red-400 mt-1">
                3 transactions this month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={itemVariants}>
        <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 shadow-2xl shadow-red-500/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recent wallet transactions and activities
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={(value: TransactionType) => handleFilterChange(value, undefined)}>
                  <SelectTrigger className="w-32 bg-black/80 border-black/60 text-white backdrop-blur-xl focus:ring-2 focus:ring-[#e63946]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-black/60 backdrop-blur-xl">
                    <SelectItem value="all" className="text-white hover:bg-black/60">All Types</SelectItem>
                    <SelectItem value="credit" className="text-white hover:bg-black/60">Credits</SelectItem>
                    <SelectItem value="debit" className="text-white hover:bg-black/60">Debits</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={(value: TransactionCategory) => handleFilterChange(undefined, value)}>
                  <SelectTrigger className="w-36 bg-black/80 border-black/60 text-white backdrop-blur-xl focus:ring-2 focus:ring-[#e63946]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-black/60 backdrop-blur-xl">
                    <SelectItem value="all" className="text-white hover:bg-black/60">All Categories</SelectItem>
                    <SelectItem value="commission" className="text-white hover:bg-black/60">Commission</SelectItem>
                    <SelectItem value="fee" className="text-white hover:bg-black/60">Fees</SelectItem>
                    <SelectItem value="subscription" className="text-white hover:bg-black/60">Subscription</SelectItem>
                    <SelectItem value="refund" className="text-white hover:bg-black/60">Refunds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-black/40 hover:bg-black/60 transition-colors duration-200 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transaction.date)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.category === 'commission' ? 'bg-blue-500/20 text-blue-400' :
                          transaction.category === 'fee' ? 'bg-yellow-500/20 text-yellow-400' :
                          transaction.category === 'subscription' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {balanceVisible ? formatCurrency(transaction.amount) : '••••••'}
                    </p>
                    <p className="text-xs text-gray-400 uppercase">{transaction.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No transactions found for the selected filters</p>
              </div>
            )}
            
            {/* Pagination */}
            {filteredTransactions.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default WalletManagement;