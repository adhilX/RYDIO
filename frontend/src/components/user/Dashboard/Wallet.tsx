import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';

const dummyBalance = 2450.75;
const dummyTransactions = [
  { id: 1, type: 'credit', amount: 1200, date: '2024-06-01', description: 'Refund from RYDIO' },
  { id: 2, type: 'debit', amount: 350, date: '2024-05-28', description: 'Car Booking Payment' },
  { id: 3, type: 'credit', amount: 800, date: '2024-05-20', description: 'Wallet Top-up' },
  { id: 4, type: 'debit', amount: 200, date: '2024-05-15', description: 'Service Fee' },
  { id: 5, type: 'debit', amount: 100, date: '2024-05-10', description: 'Car Booking Payment' },
];

export default function Wallet() {
  const [page, setPage] = useState(1);
  const perPage = 3;
  const totalPages = Math.ceil(dummyTransactions.length / perPage);
  const paginatedTx = dummyTransactions.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="w-full p-4 md:p-8 font-sans">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-[#6DA5C0]/90 to-[#232b3a] rounded-2xl shadow-lg p-8 flex flex-col items-center mb-8">
        <span className="uppercase text-sm tracking-widest text-white/70 font-semibold mb-2">Wallet Balance</span>
        <span className="text-4xl md:text-5xl font-extrabold text-white mb-2">₹{dummyBalance.toLocaleString()}</span>
        <span className="text-white/60 text-xs">Updated just now</span>
      </div>

      {/* Transaction History */}
      <div className="bg-[#181f23] rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-dm-sans">Transaction History</h2>
        </div>
        <div className="divide-y divide-white/10">
          {paginatedTx.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 py-4">
              <div className="flex-shrink-0">
                {tx.type === 'credit' ? (
                  <ArrowDownCircle className="w-7 h-7 text-[#6DA5C0] bg-white/10 rounded-full p-1" />
                ) : (
                  <ArrowUpCircle className="w-7 h-7 text-red-400 bg-white/10 rounded-full p-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{tx.description}</div>
                <div className="text-xs text-white/50">{new Date(tx.date).toLocaleDateString()}</div>
              </div>
              <div className={`font-bold text-base ${tx.type === 'credit' ? 'text-[#6DA5C0]' : 'text-red-400'}`}>{tx.type === 'credit' ? '+' : '-'}₹{tx.amount}</div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-[#232b3a] text-white/80 hover:bg-[#6DA5C0] hover:text-white font-semibold transition disabled:opacity-40"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-2 text-white/60 self-center">Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 rounded-lg bg-[#232b3a] text-white/80 hover:bg-[#6DA5C0] hover:text-white font-semibold transition disabled:opacity-40"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
