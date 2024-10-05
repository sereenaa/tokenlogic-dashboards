import { useState, useEffect } from 'react';
import AaveStkbptHistogramChart from './HistogramChart';
import AaveCompositionChart from './CompositionChart';
import AaveCompositionTable from './CompositionTable';

export default function AaveDash3({ className }) {
  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [topLps, setTopLps] = useState(5);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/composition?topLps=${topLps}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
    async function fetchDataAll() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/composition?topLps=all`);
      const result = await response.json();
      setDataAll(result);
    }
    fetchDataAll();
  }, [topLps]);

  return (
    <main className={`container mx-auto p-4 bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT Composition</h1>
      <div className="flex flex-col items-left">
        <AaveStkbptHistogramChart data={dataAll} />
        <div>
          <label htmlFor="topLps" className="mr-2">Top LPs:</label>
          <select
            id="topLps"
            value={topLps}
            onChange={(e) => setTopLps(e.target.value)}
            className="p-2 border rounded bg-background text-foreground"
          >
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
          </select>
        </div>
      </div>
      <AaveCompositionChart data={data} />
      <AaveCompositionTable />
    </main>
  );
}