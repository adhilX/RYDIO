import Pagination from '@/components/Pagination';
import { getWallet } from '@/services/wallet /walletService';
import type { RootState } from '@/store/store';
import type { Transaction, WalletData } from '@/Types/User/walletData';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export default function Wallet() {
  const user = useSelector((state:RootState) => state.auth.user);
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
        setTransactions(walletData.transactions || []);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  return (
    <div className="w-full p-4 md:p-8 font-sans">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-[#6DA5C0]/90 to-[#232b3a] rounded-2xl shadow-lg p-8 flex flex-col items-center mb-8">
        <span className="uppercase text-sm tracking-widest text-white/70 font-semibold mb-2">Wallet Balance</span>
        <span className="text-4xl md:text-5xl font-extrabold text-white mb-2">₹{balance}</span>
        <span className="text-white/60 text-xs">Updated just now</span>
      </div>

      {/* Transaction History */}
      <div className="bg-[#181f23] rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-dm-sans">Transaction History</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-white/60">Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-white/60">No transactions found</div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/10">
              {paginatedTx.map(tx => (
                <div key={tx._id} className="flex items-center gap-4 py-4">
                  <div className="flex-shrink-0">
                    {tx.transactionType === 'credit' ? (
                      <ArrowDownCircle className="w-7 h-7 text-[#6DA5C0] bg-white/10 rounded-full p-1" />
                    ) : (
                      <ArrowUpCircle className="w-7 h-7 text-red-400 bg-white/10 rounded-full p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {tx.purpose.charAt(0).toUpperCase() + tx.purpose.slice(1)}
                      {tx.bookingId && ` - ${tx.bookingId}`}
                    </div>
                    <div className="text-xs text-white/50">
                      {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-white/40">
                      From: {tx.from} → To: {tx.to}
                    </div>
                  </div>
                  <div className={`font-bold text-base ${tx.transactionType === 'credit' ? 'text-[#6DA5C0]' : 'text-red-400'}`}>
                    {tx.transactionType === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
             <Pagination onPageChange={setPage} currentPage={page} totalPages={totalPages} />
            )}
          </>
        )}
      </div>
     </div>
  );
}
