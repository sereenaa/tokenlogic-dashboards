import React, { useState, useEffect } from 'react';
import BalancerPoolBarChart from './BalancerPoolChart';

const AaveDash6 = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('7d'); // New state for selected days

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bigquery/aave/stkbpt/balancerPool?days=${days}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]); // Fetch data when 'days' changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`container mx-auto p-4 bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT Daily Stakes and Unstakes</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="days" className="mr-2"></label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="7d">7 days</option>
          <option value="30d">30 days</option>
          <option value="90d">90 days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <BalancerPoolBarChart data={data} />
    </main>
  );
};

export default AaveDash6;