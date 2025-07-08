import React, { useState, useEffect } from 'react';
import TokenUnlockScheduleChart from './TokenUnlockScheduleChart';

const TokenUnlockScheduleDash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/morpho/tokenUnlockSchedule');
        if (!response.ok) {
          throw new Error('Failed to fetch unlock schedule data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSummaryStats = (data) => {
    const totalSupply = data.reduce((sum, item) => sum + item.perc_supply, 0);
    const totalValueUSD = data.reduce((sum, item) => sum + item.value_usd, 0);
    
    const lockedItems = data.filter(item => !item.start_time || !item.end_time);
    const vestingItems = data.filter(item => item.start_time && item.end_time);
    
    const lockedSupply = lockedItems.reduce((sum, item) => sum + item.perc_supply, 0);
    const vestingSupply = vestingItems.reduce((sum, item) => sum + item.perc_supply, 0);
    
    return {
      totalSupply: totalSupply * 100,
      totalValueUSD,
      lockedSupply: lockedSupply * 100,
      vestingSupply: vestingSupply * 100,
      lockedValueUSD: lockedItems.reduce((sum, item) => sum + item.value_usd, 0),
      vestingValueUSD: vestingItems.reduce((sum, item) => sum + item.value_usd, 0),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading unlock schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  const stats = calculateSummaryStats(data);

  const maxSupply = data.length > 0 ? data[0].max_supply : null;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Morpho Token Unlock Schedule</h1>
        <p className="text-gray-400">
          Visualization of MORPHO token vesting and unlock schedule by percentage of total supply
        </p>
        {maxSupply && (
          <p className="text-gray-400 mt-2">
            Max Supply: {maxSupply.toLocaleString()} MORPHO tokens
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-white">Total Token Allocation</h3>
          <div className="text-2xl font-bold text-blue-400">{stats.totalSupply.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">${stats.totalValueUSD.toLocaleString()}</div>
          {maxSupply && (
            <div className="text-sm text-gray-400">
              {(stats.totalSupply / 100 * maxSupply).toLocaleString()} MORPHO
            </div>
          )}
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-white">Locked/Reserved</h3>
          <div className="text-2xl font-bold text-orange-400">{stats.lockedSupply.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">${stats.lockedValueUSD.toLocaleString()}</div>
          {maxSupply && (
            <div className="text-sm text-gray-400">
              {(stats.lockedSupply / 100 * maxSupply).toLocaleString()} MORPHO
            </div>
          )}
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-white">Vesting Schedule</h3>
          <div className="text-2xl font-bold text-green-400">{stats.vestingSupply.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">${stats.vestingValueUSD.toLocaleString()}</div>
          {maxSupply && (
            <div className="text-sm text-gray-400">
              {(stats.vestingSupply / 100 * maxSupply).toLocaleString()} MORPHO
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Cumulative Token Unlock Schedule</h2>
        <div style={{ height: '500px' }}>
          <TokenUnlockScheduleChart data={data} />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Unlock Schedule Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
                             <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Supply %</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Tokens</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Value (USD)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Start Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">End Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-200">Description</th>
              </tr>
            </thead>
                         <tbody className="divide-y divide-gray-700">
              {data.map((item, index) => (
                                 <tr key={index} className="hover:bg-gray-800">
                  <td className="px-4 py-2 text-sm font-medium text-gray-200">
                    {item.description.split(' - ')[0]}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {(item.perc_supply * 100).toFixed(1)}%
                  </td>
                                     <td className="px-4 py-2 text-sm text-gray-300">
                     {maxSupply ? (item.perc_supply * maxSupply).toLocaleString() : 'N/A'}
                   </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    ${item.value_usd?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {item.start_time ? new Date(item.start_time.value || item.start_time).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {item.end_time ? new Date(item.end_time.value || item.end_time).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-300">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenUnlockScheduleDash; 