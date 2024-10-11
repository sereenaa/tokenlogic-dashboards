import { useState, useEffect } from 'react';
import AaveStkbptHistogramChart from './HistogramChart';
import AaveCompositionChart from './CompositionChart';
import AaveCompositionTable from './CompositionTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function AaveDash3({ className }) {
  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [topLps, setTopLps] = useState(5);
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

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
      <div className="flex items-center mt-4">
        <FontAwesomeIcon
          icon={showQuery ? faChevronDown : faChevronRight}
          className="mr-2 cursor-pointer"
          onClick={() => setShowQuery(!showQuery)}
        />
        <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
          Table: tokenlogic-data-dev.datamart_aave.aave_stkbpt_composition
        </em>
      </div>
      {showQuery && (
        <div className="mt-4 p-4 rounded bg-light-background">
          <h3 className="font-semibold">Full Data Query</h3>
          <pre>
            <code>
              {`SELECT 
  address,
  num_stk_lp_tokens,
  total_num_stk_lp_tokens,
  perc
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_composition
ORDER BY perc DESC;`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Top N LPs</h3>
          <pre>
            <code>
              {`SELECT 
  address,
  num_stk_lp_tokens,
  total_num_stk_lp_tokens,
  perc
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_composition
ORDER BY perc DESC
LIMIT ${topLps};`}
            </code>
          </pre>
        </div>
      )}
    </main>
  );
}