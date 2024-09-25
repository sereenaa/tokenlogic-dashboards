import { useState, useEffect } from 'react';
import AaveInvestmentAnalysisChart from './AaveStkbptInvestmentAnalysisChart';

export default function AaveDash2() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState('30d');

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

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/bigquery/aaveStkbptInvestmentAnalysisQuery?days=${days}&type=data`);
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, [days]); // Fetch data when 'days' changes

  useEffect(() => {
    async function fetchValues() {
      const response = await fetch(`/api/bigquery/aaveStkbptInvestmentAnalysisQuery?type=values`);
      const result = await response.json();

      const initialData = result[0];
      const currentData = result[1];

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



  return (
    <main className="container mx-auto p-4 h-screen flex flex-col bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT $100k Investment Analysis</h1>
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
      </div>
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
            <td className="text-right">AAVE</td>
            <td className="text-right">{Number(aaveInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(aaveCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">wstETH</td>
            <td className="text-right">{Number(wstethInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(wstethCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">Total</td>
            <td className="text-right" colSpan="2">${Number(initialTotalValue).toLocaleString()}</td>
            <td className="text-right" colSpan="2">${Number(currentTotalValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">AAVE (Non-LP)</td>
            <td className="text-right">{Number(aaveNonLpInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveNonLpInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(aaveNonLpCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(aaveNonLpCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">wstETH (Non-LP)</td>
            <td className="text-right">{Number(wstethNonLpInitialQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethNonLpInitialValue).toLocaleString()}</td>
            <td className="text-right">{Number(wstethNonLpCurrentQty).toLocaleString()}</td>
            <td className="text-right">${Number(wstethNonLpCurrentValue).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="text-right">Total (Non-LP)</td>
            <td className="text-right" colSpan="2">${Number(initialTotalNonLpValue).toLocaleString()}</td>
            <td className="text-right" colSpan="2">${Number(currentTotalNonLpValue).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <AaveInvestmentAnalysisChart data={data} />
      </div>
    </main>
  );
}