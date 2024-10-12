import { useState, useEffect } from 'react';
import BalancerPoolTVLAPRChart from './BalancerPoolTvlAprChart';

export default function AaveDash7() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('7d'); // New state for selected days
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query
  const [ibYield, setIbYield] = useState(null);
  const [swapFeeYield, setSwapFeeYield] = useState(null);
  const [emissionsYield, setEmissionsYield] = useState(null);
  const [totalYield, setTotalYield] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/balancerPoolTvlApr?days=${days}`);
      const result = await response.json();
      setData(result);
    }
    async function fetchAverageYields() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/balancerPoolTvlApr?days=${days}&type=avgYields`);
      const result = await response.json();
      console.log(result)
      setIbYield(result[0].average_ib_yield);
      setSwapFeeYield(result[0].average_swap_fee_yield);
      setEmissionsYield(result[0].average_aave_emissions_yield);
      setTotalYield(result[0].average_total_yield);
    }
    fetchData();
    fetchAverageYields();
  }, [days]); // Fetch data when 'days' changes


  return (
    <main className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT and 20wstETH-80AAVE Balancer Pool APRs</h1>
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
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average Interest Bearing Token Yield</h2>
          <p>{ibYield !== null ? `${ibYield}%` : 'Loading...'}</p>
        </div>
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average Swap Fee Yield</h2>
          <p>{swapFeeYield !== null ? `${swapFeeYield}%` : 'Loading...'}</p>
        </div>
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average AAVE Emissions Yield</h2>
          <p>{emissionsYield !== null ? `${emissionsYield}%` : 'Loading...'}</p>
        </div>
        <div className="ml-4 p-4 rounded-xl bg-light-background dark:bg-dark-background text-sm flex-grow">
          <h2 className="font-semibold">Average Total Yield</h2>
          <p>{totalYield !== null ? `${totalYield}%` : 'Loading...'}</p>
        </div>
      </div>
      
      <div style={{ width: 'auto', height: '80vh' }}>
        <BalancerPoolTVLAPRChart data={data} />
      </div>
      <div className="flex items-center mt-4">
          <span className="mr-2 cursor-pointer" onClick={() => setShowQuery(!showQuery)}>
            {showQuery ? 'v' : '>'}
          </span>
          <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
            Table: tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr
          </em>
        </div>
        {showQuery && (
          <div className="mt-4 p-4 rounded bg-light-background">
            <pre>
              <code>
                {days === 'all'
                  ? `select * from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr order by date;`
                  : `select * from (
  select * from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr order by date desc limit ${parseInt(days, 10)}
) order by date;`}
              </code>
            </pre>
          <br />
          <h3 className="font-semibold">Average Yields Query</h3>
          <pre>
            <code>
              {days === 'all' 
                ? `select 
  round(avg(interest_bearing_token_yield)*100, 2) as average_ib_yield
  , round(avg(swap_fee_yield)*100, 2) as average_swap_fee_yield
  , round(avg(aave_emissions_yield)*100, 2) as average_aave_emissions_yield 
  , round(avg(total_yield)*100, 2) as average_total_yield
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;` 
                : `select 
  round(avg(interest_bearing_token_yield)*100, 2) as average_ib_yield
  , round(avg(swap_fee_yield)*100, 2) as average_swap_fee_yield
  , round(avg(aave_emissions_yield)*100, 2) as average_aave_emissions_yield 
  , round(avg(total_yield)*100, 2) as average_total_yield
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr
where date >= date_sub(current_date(), interval ${parseInt(days, 10)} day);`}
            </code>
          </pre>
          </div>
        )}
    </main>
  );
}