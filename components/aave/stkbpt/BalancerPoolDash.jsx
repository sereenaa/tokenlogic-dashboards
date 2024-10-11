import React, { useState, useEffect } from 'react';
import BalancerPoolBarChart from './BalancerPoolChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AaveDash6 = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState('7d'); // New state for selected days
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

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
      <h1 className="text-2xl font-bold mb-4">20wstETH-80AAVE Balancer Pool Deposits and Withdrawals</h1>
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
      <div>
        <div className="flex items-center mt-4">
        <FontAwesomeIcon
          icon={showQuery ? faChevronDown : faChevronRight}
          className="mr-2 cursor-pointer"
          onClick={() => setShowQuery(!showQuery)}
        />
          <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
            Table: tokenlogic-data-dev.datamart_aave.aave_stkbpt_balancer_pool_deposits_withdrawals
          </em>
        </div>
        {showQuery && (
          <div className="mt-4 p-4 rounded bg-light-background">
            <pre>
              <code>
                {days === 'all'
                  ? `SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_balancer_pool_deposits_withdrawals ORDER BY day;`
                  : `SELECT * FROM (
  SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_balancer_pool_deposits_withdrawals ORDER BY day DESC LIMIT ${parseInt(days, 10)}
) ORDER BY day;`}
              </code>
            </pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default AaveDash6;