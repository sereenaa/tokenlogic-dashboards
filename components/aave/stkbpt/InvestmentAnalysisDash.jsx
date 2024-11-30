import { useState, useEffect } from 'react';
import AaveInvestmentAnalysisChart from './InvestmentAnalysisChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function AaveDash2({ className}) {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('30d');
  const [showCompounding, setShowCompounding] = useState(false);
  const [frequency, setFrequency] = useState('1d');
  const [compoundingData, setCompoundingData] = useState([]);
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

  const [userLpTokens, setUserLpTokens] = useState(0);

  const [aaveInitialQty, setAaveInitialQty] = useState(0);
  const [aaveInitialValue, setAaveInitialValue] = useState(0);
  const [aaveCurrentQty, setAaveCurrentQty] = useState(0);
  const [aaveCurrentValue, setAaveCurrentValue] = useState(0);
  const [wstethInitialQty, setWstethInitialQty] = useState(0);
  const [wstethInitialValue, setWstethInitialValue] = useState(0);
  const [wstethCurrentQty, setWstethCurrentQty] = useState(0);
  const [wstethCurrentValue, setWstethCurrentValue] = useState(0);
  const [initialTotalValue, setInitialTotalValue] = useState(0);
  const [currentTotalValue, setCurrentTotalValue] = useState(0);
  
  const [aaveNonLpInitialQty, setAaveNonLpInitialQty] = useState(0);
  const [aaveNonLpInitialValue, setAaveNonLpInitialValue] = useState(0);
  const [aaveNonLpCurrentQty, setAaveNonLpCurrentQty] = useState(0);
  const [aaveNonLpCurrentValue, setAaveNonLpCurrentValue] = useState(0);
  const [wstethNonLpInitialQty, setWstethNonLpInitialQty] = useState(0);
  const [wstethNonLpInitialValue, setWstethNonLpInitialValue] = useState(0);
  const [wstethNonLpCurrentQty, setWstethNonLpCurrentQty] = useState(0);
  const [wstethNonLpCurrentValue, setWstethNonLpCurrentValue] = useState(0);
  const [initialTotalNonLpValue, setInitialTotalNonLpValue] = useState(0);
  const [currentTotalNonLpValue, setCurrentTotalNonLpValue] = useState(0);

  const deploymentDate = new Date('2024-02-11');
  const today = new Date();
  const daysSinceDeployment = Math.floor((today - deploymentDate) / (1000 * 60 * 60 * 24));


  async function fetchData() {
    const response = await fetch(`/api/bigquery/aave/stkbpt/investmentAnalysis?days=${days}&type=data`);
    const result = await response.json();
    setData(result);
  };

  async function fetchCompoundingData() {
    const response = await fetch(`/api/bigquery/aave/stkbpt/investmentAnalysis?days=${days}&type=compounding&frequency=${frequency}`);
    const result = await response.json();
    setCompoundingData(result);
  };

  useEffect(() => {
    
    fetchData();
    if (showCompounding) {
      fetchCompoundingData();
    }
  }, [days]); // Fetch data when 'days' changes

  useEffect(() => {
    async function fetchValues() {
      const response = await fetch(`/api/bigquery/aave/stkbpt/investmentAnalysis?type=values`);
      const result = await response.json();

      const initialData = result[0];
      const currentData = result[1];

      setUserLpTokens(initialData.user_lp_tokens.toFixed(2));
      setAaveInitialQty(initialData.lp_user_aave_token_balance.toFixed(2));
      setAaveInitialValue(initialData.lp_user_aave_token_value.toFixed(2));
      setAaveCurrentQty(currentData.lp_user_aave_token_balance.toFixed(2));
      setAaveCurrentValue(currentData.lp_user_aave_token_value.toFixed(2));
      setWstethInitialQty(initialData.lp_user_wsteth_token_balance.toFixed(2));
      setWstethInitialValue(initialData.lp_user_wsteth_token_value.toFixed(2));
      setWstethCurrentQty(currentData.lp_user_wsteth_token_balance.toFixed(2));
      setWstethCurrentValue(currentData.lp_user_wsteth_token_value.toFixed(2));
      setInitialTotalValue((initialData.lp_user_aave_token_value + initialData.lp_user_wsteth_token_value).toFixed(2));
      setCurrentTotalValue((currentData.lp_user_aave_token_value + currentData.lp_user_wsteth_token_value).toFixed(2));
      setAaveNonLpInitialQty(initialData.non_lp_user_aave_token_balance.toFixed(2));
      setAaveNonLpInitialValue((initialData.non_lp_user_aave_token_balance * initialData.aave_usd_price).toFixed(2));
      setAaveNonLpCurrentQty(currentData.non_lp_user_aave_token_balance.toFixed(2));
      setAaveNonLpCurrentValue((currentData.non_lp_user_aave_token_balance * currentData.aave_usd_price).toFixed(2));
      setWstethNonLpInitialQty(initialData.non_lp_user_wsteth_token_balance.toFixed(2));
      setWstethNonLpInitialValue((initialData.non_lp_user_wsteth_token_balance * initialData.wsteth_usd_price).toFixed(2));
      setWstethNonLpCurrentQty(currentData.non_lp_user_wsteth_token_balance.toFixed(2));
      setWstethNonLpCurrentValue((currentData.non_lp_user_wsteth_token_balance * currentData.wsteth_usd_price).toFixed(2));
      setInitialTotalNonLpValue(
        ((initialData.non_lp_user_aave_token_balance * initialData.aave_usd_price) +
        (initialData.non_lp_user_wsteth_token_balance * initialData.wsteth_usd_price)).toFixed(2)
      );
      setCurrentTotalNonLpValue(
        ((currentData.non_lp_user_aave_token_balance * currentData.aave_usd_price) +
        (currentData.non_lp_user_wsteth_token_balance * currentData.wsteth_usd_price)).toFixed(2)
      );
    }
    fetchValues();
  }, []); // Fetch data on page load

  useEffect(() => {
    if (showCompounding) {
      fetchCompoundingData();
    }
  }, [showCompounding, frequency]); // Fetch compounding data when 'showCompounding' or 'frequency' changes

  return (
    <main className={`container mx-auto p-4 flex-grow flex flex-col bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT $100k Investment Analysis</h1>
      <p className="mb-4">Funds were deployed on 11th Feb 2024, which is {daysSinceDeployment} days ago.</p>

      <table className="table-auto w-full mb-4 text-table">
      <thead>
          <tr>
            <th className="text-right">Asset</th>
            <th className="text-right">Initial Deposit (Qty)</th>
            <th className="text-right">Initial Deposit ($)</th>
            <th className="text-right">Current Value (Qty)</th>
            <th className="text-right">Current Value ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-right">AAVE (LP)</td>
            <td className="text-right">{Number(aaveInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(aaveCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">wstETH (LP)</td>
            <td className="text-right">{Number(wstethInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(wstethCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">Total (LP)</td>
            <td className="text-right">{Number(userLpTokens).toLocaleString()} BPTs</td>
            <td className="text-right">${Number(initialTotalValue).toLocaleString()}</td>
            <td className="text-right">{Number(userLpTokens).toLocaleString()} BPTs</td>
            <td className="text-right">${Number(currentTotalValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">AAVE (Hold)</td>
            <td className="text-right">{Number(aaveNonLpInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveNonLpInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(aaveNonLpCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveNonLpCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">wstETH (Hold)</td>
            <td className="text-right">{Number(wstethNonLpInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethNonLpInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(wstethNonLpCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethNonLpCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">Total (Hold)</td>
            <td className="text-right" colSpan="2">${Number(initialTotalNonLpValue).toLocaleString()}</td>
            <td className="text-right" colSpan="2">${Number(currentTotalNonLpValue).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

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
        <button
          onClick={() => setShowCompounding(!showCompounding)}
          className="mx-2 px-4 rounded transition duration-300 button-outline"
          style={{
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '2px solid var(--button-outline)',
            fontSize: '13px',
            padding: '8px 8px',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--button-hover-bg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--button-bg)';
          }}
        >
          {showCompounding ? 'Hide Compounding Data' : 'Show Compounding Data'}
        </button>
        {showCompounding && (
          <div className="flex items-center">
            <label 
              htmlFor="frequency" 
              className="mr-2"
              style={{
                fontSize: '13px',
              }}
            >Choose compounding frequency:</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="p-2 border rounded bg-background text-foreground"
            >
              <option value="1d">1 day</option>
              <option value="7d">7 days</option>
              <option value="14d">14 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ width: 'auto', height: 'auto' }}>
        <AaveInvestmentAnalysisChart 
          data={data} 
          compoundingData={showCompounding ? compoundingData : null}  
        />
      </div>
      
      <div className="flex items-center mt-4">
        <FontAwesomeIcon
          icon={showQuery ? faChevronDown : faChevronRight}
          className="mr-2 cursor-pointer"
          onClick={() => setShowQuery(!showQuery)}
        />
        <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
          Table: tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis
        </em>
      </div>


      {showQuery && (
        <div className="mt-4 p-4 rounded bg-light-background">
          <h3 className="font-semibold">Data Table Query</h3>
          <pre>
            <code>
              {`select 
  lp_user_aave_token_balance
  , aave_usd_price
  , user_lp_tokens
  , lp_user_aave_token_balance * aave_usd_price as lp_user_aave_token_value
  , lp_user_wsteth_token_balance
  , wsteth_usd_price
  , lp_user_wsteth_token_balance * wsteth_usd_price as lp_user_wsteth_token_value
  , non_lp_user_aave_token_balance
  , non_lp_user_wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis
where date = (select max(date) from tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis)
  or date = (select min(date) from tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis)
order by date;`
              }
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Full Data Query</h3>
          <pre>
            <code>
              {days === 'all' 
                ? `SELECT 
  date
  , lp_user_total_value
  , lp_user_aave_value
  , lp_user_wsteth_value
  , lp_user_aave_token_balance
  , lp_user_wsteth_token_balance
  , non_lp_user_total_value
  , non_lp_user_aave_value
  , non_lp_user_wsteth_value
  , non_lp_user_aave_token_balance
  , non_lp_user_wsteth_token_balance
  , aave_usd_price
  , wsteth_usd_price
  , manual_il
FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis;` 
                : `SELECT * FROM tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Compounding 1d Frequency Query</h3>
          <pre>
            <code>
              {days === 'all' 
                ? `select 
  date
  , user_usd_total_value_1_day as user_usd_total_value
  , aave_usd_value_1_day as aave_usd_value
  , wsteth_usd_value_1_day as wsteth_usd_value
  , aave_token_balance_1_day as aave_token_balance
  , wsteth_token_balance_1_day as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc;`
                : `select 
  date
  , user_usd_total_value_1_day as user_usd_total_value
  , aave_usd_value_1_day as aave_usd_value
  , wsteth_usd_value_1_day as wsteth_usd_value
  , aave_token_balance_1_day as aave_token_balance
  , wsteth_token_balance_1_day as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Compounding 7d Frequency Query</h3>
          <pre>
            <code>
            {days === 'all' 
            ? `select 
  date
  , user_usd_total_value_7_days as user_usd_total_value
  , aave_usd_value_7_days as aave_usd_value
  , wsteth_usd_value_7_days as wsteth_usd_value
  , aave_token_balance_7_days as aave_token_balance
  , wsteth_token_balance_7_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc;`
            : `select 
  date
  , user_usd_total_value_7_days as user_usd_total_value
  , aave_usd_value_7_days as aave_usd_value
  , wsteth_usd_value_7_days as wsteth_usd_value
  , aave_token_balance_7_days as aave_token_balance
  , wsteth_token_balance_7_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Compounding 14d Frequency Query</h3>
          <pre>
            <code>
            {days === 'all' 
              ? `select 
  date
  , user_usd_total_value_14_days as user_usd_total_value
  , aave_usd_value_14_days as aave_usd_value
  , wsteth_usd_value_14_days as wsteth_usd_value
  , aave_token_balance_14_days as aave_token_balance
  , wsteth_token_balance_14_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc;`
              : `select 
  date
  , user_usd_total_value_14_days as user_usd_total_value
  , aave_usd_value_14_days as aave_usd_value
  , wsteth_usd_value_14_days as wsteth_usd_value
  , aave_token_balance_14_days as aave_token_balance
  , wsteth_token_balance_14_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Compounding 30d Frequency Query</h3>
          <pre>
            <code>
            {days === 'all' 
              ? `select 
  date
  , user_usd_total_value_30_days as user_usd_total_value
  , aave_usd_value_30_days as aave_usd_value
  , wsteth_usd_value_30_days as wsteth_usd_value
  , aave_token_balance_30_days as aave_token_balance
  , wsteth_token_balance_30_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc;`
              : `select 
  date
  , user_usd_total_value_30_days as user_usd_total_value
  , aave_usd_value_30_days as aave_usd_value
  , wsteth_usd_value_30_days as wsteth_usd_value
  , aave_token_balance_30_days as aave_token_balance
  , wsteth_token_balance_30_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
          <br />
          <h3 className="font-semibold">Compounding 90d Frequency Query</h3>
          <pre>
            <code>
            {days === 'all' 
              ? `select 
  date
  , user_usd_total_value_90_days as user_usd_total_value
  , aave_usd_value_90_days as aave_usd_value
  , wsteth_usd_value_90_days as wsteth_usd_value
  , aave_token_balance_90_days as aave_token_balance
  , wsteth_token_balance_90_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc;`
              : `select 
  date
  , user_usd_total_value_90_days as user_usd_total_value
  , aave_usd_value_90_days as aave_usd_value
  , wsteth_usd_value_90_days as wsteth_usd_value
  , aave_token_balance_90_days as aave_token_balance
  , wsteth_token_balance_90_days as wsteth_token_balance
from tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis
order by date desc limit ${parseInt(days, 10)};`}
            </code>
          </pre>
        </div>
      )}
    </main>



  );
}