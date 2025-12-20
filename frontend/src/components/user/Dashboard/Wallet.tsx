import Pagination from '@/components/Pagination';
import { getWallet } from '@/services/wallet/walletService';
import type { RootState } from '@/store/store';
import type { Transaction, WalletData } from '@/Types/User/walletData';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export default function Wallet() {
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    throw new Error('User ID is not available');
  }
  const [page, setPage] = useState(1);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const perPage = 5;
  const totalPages = Math.ceil(transactions.length / perPage);
  const paginatedTx = transactions.slice((page - 1) * perPage, page * perPage);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getWallet(user._id!, 1, 10);
        const walletData: WalletData = response;
        setBalance(walletData.balance);
        setTransactions(walletData.transactions.reverse() || []);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 font-sans h-[calc(100vh-100px)] flex flex-col">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">My Wallet</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your funds and transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 flex-1">
        {/* Left Column: Balance */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
          {/* Balance Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10 shadow-2xl h-fit">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Total Balance</span>
              <div className="relative">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  ₹{balance.toLocaleString()}
                </span>
                {/* Decorative glow behind number */}
                <div className="absolute inset-0 bg-white/20 blur-3xl -z-10 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats (Placeholder) */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hidden lg:block">
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Overview</h3>
            <div className="space-y-4">
              <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <ArrowDownCircle size={20} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">Credits</span>
                </div>
                <span className="text-white font-bold text-lg">
                  {transactions.filter(t => t.transactionType === 'credit').length}
                </span>
              </div>
              <div className="bg-black/40 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                    <ArrowUpCircle size={20} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">Debits</span>
                </div>
                <span className="text-white font-bold text-lg">
                  {transactions.filter(t => t.transactionType === 'debit').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl flex flex-col min-h-0">
          <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {loading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                <div className="text-gray-500">Loading transactions...</div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.414l5 5a1 1 0 01.414 1.414V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-gray-500">No transactions yet</div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {paginatedTx.map((tx) => (
                  <div key={tx._id} className="group p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-white/5 transition-all duration-200">
                    <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border ${tx.transactionType === 'credit'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                      {tx.transactionType === 'credit' ? (
                        <ArrowDownCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-bold text-sm md:text-base truncate pr-2">
                          {tx.transactionType === 'credit' ? 'Money Added' : 'Withdrawal'}
                        </h3>
                        <span className={`text-base md:text-lg font-bold ${tx.transactionType === 'credit' ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {tx.transactionType === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <div className="flex flex-col sm:flex-row sm:gap-2 text-gray-500">
                          <span className="capitalize text-gray-400">{tx.purpose}</span>
                          {tx.bookingId && (
                            <span className="text-gray-600 font-mono text-[10px] md:text-xs py-0.5 px-2 bg-white/5 rounded mx-0 sm:mx-1 mt-1 sm:mt-0 w-fit">
                              ID: {tx.bookingId}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-600 text-[10px] md:text-xs text-right whitespace-nowrap ml-2">
                          {new Date(tx.createdAt).toLocaleDateString()}
                          <span className="hidden sm:inline"> • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-white/5 flex justify-center flex-shrink-0 bg-black/20">
              <Pagination onPageChange={setPage} currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
