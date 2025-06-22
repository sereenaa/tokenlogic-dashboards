import React, { useState, useEffect } from 'react';
import DefiProtocolUnlocksChart from './DefiProtocolUnlocksChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DefiProtocolUnlocksDash = ({ className }) => {
  const [data, setData] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showQuery, setShowQuery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bigquery/defiProtocolUnlocks?symbol=${selectedSymbol}`);
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

    const fetchSymbols = async () => {
      try {
        const response = await fetch('/api/bigquery/defiProtocolSymbols');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setSymbols(result.map(item => item.symbol));
      } catch (error) {
        console.error('Error fetching symbols:', error);
      }
    };

    fetchData();
    fetchSymbols();
  }, [selectedSymbol]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`container mx-auto p-4 bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">DeFi Protocol Unlocks by Day</h1>
      
      <div className="mb-4">
        <label htmlFor="symbol" className="mr-2">Select Symbol:</label>
        <select
          id="symbol"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="p-2 border rounded bg-background text-foreground"
        >
          <option value="all">All Symbols</option>
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[800px] mb-4">
        <DefiProtocolUnlocksChart data={data} selectedSymbol={selectedSymbol} />
      </div>

      <div className="flex items-center mt-4">
        <FontAwesomeIcon
          icon={showQuery ? faChevronDown : faChevronRight}
          className="mr-2 cursor-pointer"
          onClick={() => setShowQuery(!showQuery)}
        />
        <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
          Table: datamart_common.defi_protocol_unlocks_by_day
        </em>
      </div>
      
      {showQuery && (
        <div className="mt-4 p-4 rounded bg-light-background">
          <h3 className="font-semibold">Data Query</h3>
          <pre>
            <code>
              {selectedSymbol && selectedSymbol !== 'all' 
                ? `SELECT 
  block_day,
  symbol,
  fdv_usd,
  circulating_supply_usd
FROM \`datamart_common.defi_protocol_unlocks_by_day\`
WHERE symbol = '${selectedSymbol}'
ORDER BY block_day ASC`
                : `SELECT 
  block_day,
  symbol,
  fdv_usd,
  circulating_supply_usd
FROM \`datamart_common.defi_protocol_unlocks_by_day\`
ORDER BY block_day ASC`
              }
            </code>
          </pre>
        </div>
      )}
    </main>
  );
};

export default DefiProtocolUnlocksDash; 