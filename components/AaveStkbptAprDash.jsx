import { useState, useEffect } from 'react';
import AaveAPRChart from './AaveStkbptAprChart';

export default function AaveDash() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('30d'); // New state for selected days
  const [swapFeeApr, setSwapFeeApr] = useState(null);
  const [emissionsApr, setEmissionsApr] = useState(null);
  const [totalLpApr, setTotalLpApr] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aaveStkbptAprQuery?days=${days}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [days]); // Fetch data when 'days' changes

  useEffect(() => {
    async function fetchSwapFeeApr() {
      const response = await fetch(`/api/bigquery/aaveStkbptAprQuery?days=${days}&type=swapFeeApr`);
      const result = await response.json();
      setSwapFeeApr(result[0].average);
    }
    async function fetchEmissionsApr() {
      const response = await fetch(`/api/bigquery/aaveStkbptAprQuery?days=${days}&type=emissionsApr`);
      const result = await response.json();
      setEmissionsApr(result[0].average);
    }
    async function fetchTotalLpApr() {
      const response = await fetch(`/api/bigquery/aaveStkbptAprQuery?days=${days}&type=totalLpApr`);
      const result = await response.json();
      setTotalLpApr(result[0].average);
    }
    fetchSwapFeeApr();
    fetchEmissionsApr();
    fetchTotalLpApr();
  }, [days]); // Fetch APR data when 'days' changes


  return (
    <main className="container mx-auto p-4 h-screen flex flex-col bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT APR</h1>
      <div className="flex items-center mb-4">
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
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average Swap Fee APR</h2>
          <p>{swapFeeApr !== null ? `${swapFeeApr}%` : 'Loading...'}</p>
        </div>
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average AAVE Emissions APR</h2>
          <p>{emissionsApr !== null ? `${emissionsApr}%` : 'Loading...'}</p>
        </div>
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average Total LP APR</h2>
          <p>{totalLpApr !== null ? `${totalLpApr}%` : 'Loading...'}</p>
        </div>
      </div>
      <div className="flex-grow">
        <AaveAPRChart data={data} />
      </div>
    </main>
  );
}