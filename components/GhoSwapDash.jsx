import { useState, useEffect } from 'react';
import GHOSwapChart from './GhoSwapChart';

export default function GhoSwapDash() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/bigquery/testQuery');
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">GHO Swap Activity</h1>
      <div className="flex-grow">
        <GHOSwapChart data={data} />
      </div>
    </main>
  );
}