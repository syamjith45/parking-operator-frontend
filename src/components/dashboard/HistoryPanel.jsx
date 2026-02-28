import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Search, Filter, ChevronLeft, ChevronRight, Car, Bike, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

const GET_TRANSACTION_HISTORY = gql`
  query transactionHistory(
    $page: Int
    $page_size: Int
    $status: String
    $vehicle_type: String
    $start_date: DateTime
    $end_date: DateTime
    $search: String
  ) {
    transactionHistory(
      page: $page
      page_size: $page_size
      status: $status
      vehicle_type: $vehicle_type
      start_date: $start_date
      end_date: $end_date
      search: $search
    ) {
      transactions {
        session_id
        vehicle_number
        vehicle_type
        driver_phone
        status
        entry_time
        exit_time
        duration_minutes
        declared_duration_hours
        overstay_minutes
        overstay_fee
        total_amount
        created_by_staff {
          name
          role
        }
      }
      total_count
      page
      page_size
    }
  }
`;

export const HistoryPanel = () => {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [status, setStatus] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Prepare variables, converting empty strings to undefined to not send them,
    // and standardizing date formats
    const queryVariables = {
        page,
        page_size: pageSize,
        ...(status && { status }),
        ...(vehicleType && { vehicle_type: vehicleType }),
        ...(search && { search }),
        ...(startDate && { start_date: new Date(`${startDate}T00:00:00`).toISOString() }),
        ...(endDate && { end_date: new Date(`${endDate}T23:59:59.999`).toISOString() })
    };

    const { data, loading, error, refetch } = useQuery(GET_TRANSACTION_HISTORY, {
        variables: queryVariables,
        fetchPolicy: 'cache-and-network'
    });

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        return d.toLocaleString([], {
            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    const transactions = data?.transactionHistory?.transactions || [];
    const totalCount = data?.transactionHistory?.total_count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-1 mb-4 shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Transaction History</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">View and filter detailed records.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 mb-4 shrink-0 px-1">
                <div className="flex items-center gap-2">
                    <div className="relative group flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                        <input
                            placeholder="Search vehicle, phone, ID..."
                            className="w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "p-2 rounded-xl border transition-colors flex items-center justify-center",
                            isFilterOpen || status || vehicleType || startDate || endDate
                                ? "bg-brand-blue/10 border-brand-blue/20 text-brand-blue dark:bg-brand-blue/20 dark:border-brand-blue/30"
                                : "bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        )}
                    >
                        <Filter className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-stone-50 transition-colors flex items-center justify-center"
                        title="Refresh"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    </button>
                </div>

                {/* Filters Collapse */}
                {isFilterOpen && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl animate-in fade-in slide-in-from-top-2 text-sm shadow-sm dark:shadow-none">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                            <select
                                className="bg-stone-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-blue"
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            >
                                <option value="">All</option>
                                <option value="ACTIVE">Active</option>
                                <option value="EXITED">Exited</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</label>
                            <select
                                className="bg-stone-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-blue"
                                value={vehicleType}
                                onChange={(e) => { setVehicleType(e.target.value); setPage(1); }}
                            >
                                <option value="">All</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">From</label>
                            <input
                                type="date"
                                className="bg-stone-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-blue"
                                value={startDate}
                                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">To</label>
                            <input
                                type="date"
                                className="bg-stone-50 dark:bg-slate-800 border-none rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-blue"
                                value={endDate}
                                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                            />
                        </div>
                        {(status || vehicleType || startDate || endDate) && (
                            <div className="col-span-2 flex justify-end">
                                <button
                                    onClick={() => {
                                        setStatus('');
                                        setVehicleType('');
                                        setStartDate('');
                                        setEndDate('');
                                        setPage(1);
                                    }}
                                    className="text-xs text-rose-500 font-medium hover:text-rose-600 px-2 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table Area Container */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex-1 overflow-auto">
                    {loading && (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                            <div className="animate-spin h-8 w-8 border-4 border-stone-200 dark:border-slate-700 border-t-brand-blue rounded-full mb-4"></div>
                            <p className="text-sm font-medium text-slate-500">Loading history...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                            <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-full mb-3">
                                <FileText className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                            </div>
                            <p className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-1">Error fetching data</p>
                            <p className="text-xs text-rose-500/80 dark:text-rose-400/80 max-w-[200px] break-words">{error.message}</p>
                        </div>
                    )}

                    {!loading && !error && transactions.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center opacity-70 h-full">
                            <div className="bg-stone-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                                <FileText className="h-8 w-8 text-stone-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-bold">No Records Found</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Adjust filters or search terms to find sessions.
                            </p>
                        </div>
                    )}

                    {!loading && !error && transactions.length > 0 && (
                        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                            <thead className="bg-stone-50 dark:bg-slate-950/50 sticky top-0 z-10 shadow-sm dark:shadow-none">
                                <tr>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Vehicle</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Type</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Status</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Time</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Duration</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Overstay</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Amount</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Staff</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Phone</th>
                                    <th className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900">Session ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-slate-800/60">
                                {transactions.map((tx) => (
                                    <tr key={tx.session_id} className="hover:bg-stone-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                            {tx.vehicle_number || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 capitalize">
                                                {tx.vehicle_type === 'car' ? <Car className="h-3.5 w-3.5" /> : <Bike className="h-3.5 w-3.5" />}
                                                {tx.vehicle_type}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                tx.status === 'EXPIRED' || tx.status === 'EXITED'
                                                    ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            )}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col gap-0.5">
                                                <span><span className="text-[10px] uppercase text-slate-400 dark:text-slate-500">In:</span> {formatDate(tx.entry_time)}</span>
                                                {tx.exit_time && <span><span className="text-[10px] uppercase text-slate-400 dark:text-slate-500">Out:</span> {formatDate(tx.exit_time)}</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {(tx.duration_minutes / 60).toFixed(1)}h
                                                </span>
                                                <span className="text-slate-400 text-[10px]">
                                                    / {tx.declared_duration_hours || 0}h
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {tx.overstay_minutes > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-rose-600 dark:text-rose-400 font-medium">
                                                        {(tx.overstay_minutes / 60).toFixed(1)}h
                                                    </span>
                                                    <span className="text-[10px] text-rose-500/70">
                                                        {formatCurrency(tx.overstay_fee)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-brand-blue">
                                            {formatCurrency(tx.total_amount)}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                            {tx.created_by_staff ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{tx.created_by_staff.name}</span>
                                                    <span className="text-[10px] text-slate-400">{tx.created_by_staff.role}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-slate-500">
                                            {tx.driver_phone || '-'}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-slate-400 text-[10px]">
                                            {tx.session_id.slice(-8)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Footer */}
                {!loading && !error && totalCount > 0 && (
                    <div className="shrink-0 border-t border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/30 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <div className="text-slate-500 dark:text-slate-400 font-medium">
                            Showing <span className="font-bold text-slate-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(page * pageSize, totalCount)}</span> of <span className="font-bold text-slate-900 dark:text-white">{totalCount}</span> entries
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-1 rounded-md text-slate-600 hover:bg-stone-200 disabled:opacity-50 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="px-3 font-medium text-slate-700 dark:text-slate-300">
                                Page {page} of {totalPages}
                            </div>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="p-1 rounded-md text-slate-600 hover:bg-stone-200 disabled:opacity-50 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
