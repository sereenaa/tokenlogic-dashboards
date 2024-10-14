import { useState, useEffect } from 'react';
import AaveAPRChart from './AprChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function AaveDash() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('30d'); // New state for selected days
  const [swapFeeApr, setSwapFeeApr] = useState(null);
  const [emissionsApr, setEmissionsApr] = useState(null);
  const [totalLpApr, setTotalLpApr] = useState(null);
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/apr?days=${days}`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [days]); // Fetch data when 'days' changes

  useEffect(() => {
    async function fetchSwapFeeApr() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/apr?days=${days}&type=swapFeeApr`);
      const result = await response.json();
      setSwapFeeApr(result[0].average);
    }
    async function fetchEmissionsApr() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/apr?days=${days}&type=emissionsApr`);
      const result = await response.json();
      setEmissionsApr(result[0].average);
    }
    async function fetchTotalLpApr() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/apr?days=${days}&type=totalLpApr`);
      const result = await response.json();
      setTotalLpApr(result[0].average);
    }
    fetchSwapFeeApr();
    fetchEmissionsApr();
    fetchTotalLpApr();
  }, [days]); // Fetch APR data when 'days' changes


  return (
    <main className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT APR</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="days" className="mr-2"></label>
        <select
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="30d">30 days</option>
          <option value="90d">90 days</option>
          <option value="180d">180 days</option>
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
      <div style={{ width: 'auto', height: '80vh' }}>
        <AaveAPRChart data={data} />
      </div>
      <div>
        <div className="flex items-center my-6">
          <FontAwesomeIcon
            icon={showQuery ? faChevronDown : faChevronRight}
            className="mr-2 cursor-pointer"
            onClick={() => setShowQuery(!showQuery)}
          />
          <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
            Table: `{process.env.GOOGLE_CLOUD_PROJECT}`.datamart_aave.aave_stkbpt_apr
          </em>
        </div>
        {showQuery && (
        <div className="mt-4 p-4 rounded bg-light-background">
          <h3 className="font-semibold">Full Data Query</h3>
          <pre>
            <code>
              {days === 'all' 
                ?  `SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;`
                : `SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr ORDER BY date DESC limit ${parseInt(days, 10)};`
              }
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Average Swap Fee APR Query</h3>
          <pre>
            <code>
              {days === 'all' 
                ? `SELECT ROUND(AVG(apr_from_swap_fees), 2) AS average FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;` 
                : `SELECT ROUND(AVG(apr_from_swap_fees), 2) AS average 
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr 
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${parseInt(days, 10)} DAY);`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Average Emissions APR Query</h3>
          <pre>
            <code>
              {days === 'all'
                ? `SELECT ROUND(AVG(apr_from_emissions), 2) AS average FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;`
                : `SELECT ROUND(AVG(apr_from_emissions), 2) AS average 
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr 
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${parseInt(days, 10)} DAY);`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Average Total LP APR Query</h3>
          <pre>
            <code>
              {days === 'all'
                ? `SELECT ROUND(AVG(apr_from_swap_fees + apr_from_emissions), 2) AS average FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;`
                : `SELECT ROUND(AVG(apr_from_swap_fees + apr_from_emissions), 2) AS average 
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr 
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${parseInt(days, 10)} DAY);`}
            </code>
          </pre>
        </div>
      )}
      </div>
    </main>
  );
}