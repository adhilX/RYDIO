import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Calendar,Filter,RefreshCw,CreditCard,ArrowUpRight,ArrowDownLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/Pagination';
import { getwallet } from '@/services/admin/walletServece';
import type { TransactionType, TransactionCategory, WalletDetails } from '@/Types/admin/walletData';


function WalletManagement() {
  const [filterType, setFilterType] = useState<TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const {walletDetails}= await getwallet(currentPage, itemsPerPage);
        setWalletDetails(walletDetails.wallet);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  // Filter transactions
  const filteredTransactions = walletDetails?.transactions?.filter(transaction => {
    const typeMatch = filterType === 'all' || transaction.transactionType === filterType;
    const categoryMatch = filterCategory === 'all' || transaction.purpose === filterCategory;
    return typeMatch && categoryMatch;
  }) || [];

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
    try {
      const walletData = await getwallet(currentPage, itemsPerPage);
      setWalletDetails(walletData.walletDetails);
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
    } finally {
      setIsRefreshing(false);
    }
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
            className="bg-black/80 border-black/60 text-white cursor-pointer hover:bg-black/60 backdrop-blur-xl"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
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

                <DollarSign className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '••••••••' : `₹${walletDetails?.total_balance || 0}`}
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
                {isLoading ? '••••••••' : `₹${walletDetails?.commission_balance || 0}`}
              </div>
              <p className="text-xs text-green-400 mt-1">
                Commission Balance
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
                {isLoading ? '••••••••' : `₹${walletDetails?.balance || 0}`}
              </div>
              <p className="text-xs text-red-400 mt-1">
                balance
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
                {/* <Select value={filterCategory} onValueChange={(value: TransactionCategory) => handleFilterChange(undefined, value)}>
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
                </Select> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-black/40 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                      <div>
                        <div className="w-32 h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="w-24 h-3 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="w-12 h-3 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                paginatedTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-black/40 hover:bg-black/60 transition-colors duration-200 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.transactionType === 'credit' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {transaction.transactionType === 'credit' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {transaction.purpose.charAt(0).toUpperCase() + transaction.purpose.slice(1)} - {transaction.bookingId}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(transaction.createdAt)}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.purpose === 'commission' ? 'bg-blue-500/20 text-blue-400' :
                            transaction.purpose === 'penalty' ? 'bg-yellow-500/20 text-yellow-400' :
                            transaction.purpose === 'refund' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {transaction.purpose.charAt(0).toUpperCase() + transaction.purpose.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.transactionType === 'debit' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.transactionType === 'debit' ? '+' : '-'}
                        ₹{transaction.amount}
                      </p>
                      {transaction.from!= 'admin'&&(<p className="text-xs text-gray-400 uppercase">From: {transaction.from }</p>)}
                    </div>
                  </motion.div>
                ))
              )}
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