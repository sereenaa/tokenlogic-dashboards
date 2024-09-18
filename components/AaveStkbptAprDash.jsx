import { useState, useEffect } from 'react';
import AaveAPRChart from './AaveStkbptAprChart';

export default function AaveDash() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('30d'); // New state for selected days

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aaveStkbptQuery?days=${days}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [days]); // Fetch data when 'days' changes

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT APR</h1>
      <div className="mb-4">
        <label htmlFor="days" className="mr-2"></label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="30d">30d</option>
          <option value="90d">90d</option>
          <option value="180d">180d</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="flex-grow">
        <AaveAPRChart data={data} />
      </div>
    </main>
  );
}