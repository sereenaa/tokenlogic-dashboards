import { useState, useEffect } from 'react';
import AaveCompositionChart from './AaveStkbptCompositionChart';
import AaveCompositionTable from './AaveStkbptCompositionTable';

export default function AaveDash3({ className }) {
  const [data, setData] = useState([]);
  const [topLps, setTopLps] = useState('all');

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aaveStkbptCompositionQuery?topLps=${topLps}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [topLps]);

  return (
    <main className={`container mx-auto mb-20 p-4 flex-grow h-screen flex flex-col bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT Composition</h1>
      <div className="flex items-center">
        <label htmlFor="topLps" className="mr-2">Top LPs:</label>
        <select
          id="topLps"
          value={topLps}
          onChange={(e) => setTopLps(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="all">All</option>
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
        </select>
      </div>
      <div className="flex-grow">
        <AaveCompositionChart data={data} />
        <AaveCompositionTable />
      </div>
    </main>
  );
}