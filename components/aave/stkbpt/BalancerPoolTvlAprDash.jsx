import { useState, useEffect } from 'react';
import BalancerPoolTVLAPRChart from './BalancerPoolTvlAprChart';

export default function AaveDash7() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('7d'); // New state for selected days
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/balancerPoolTvlApr?days=${days}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [days]); // Fetch data when 'days' changes


  return (
    <main className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Balancer 20wstETH-80AAVE Pool TVL and APR</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="days" className="mr-2"></label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="7d">7 days</option>
          <option value="14d">14 days</option>
          <option value="30d">30 days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div style={{ width: 'auto', height: '80vh' }}>
        <BalancerPoolTVLAPRChart data={data} />
      </div>
      <div className="flex items-center mt-4">
          <span className="mr-2 cursor-pointer" onClick={() => setShowQuery(!showQuery)}>
            {showQuery ? 'v' : '>'}
          </span>
          <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
            Table: tokenlogic-data-dev.datamart_aave.aave_balancer_pool_20wsteth_80aave_tvl_apr
          </em>
        </div>
        {showQuery && (
          <div className="mt-4 p-4 rounded bg-light-background">
            <pre>
              <code>
                {days === 'all'
                  ? `SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_balancer_pool_20wsteth_80aave_tvl_apr ORDER BY date;`
                  : `SELECT * FROM (
  SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_balancer_pool_20wsteth_80aave_tvl_apr ORDER BY date DESC LIMIT ${parseInt(days, 10)}
) ORDER BY date;`}
              </code>
            </pre>
          </div>
        )}
    </main>
  );
}