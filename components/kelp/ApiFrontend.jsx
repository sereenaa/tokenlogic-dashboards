import React, { useState } from 'react';

const KelpApiFrontend = () => {
  const [userAddress, setUserAddress] = useState('');
  const [blockHeight, setBlockHeight] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch('/api/kelp/aave_rsETH_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          blockHeight: blockHeight ? parseInt(blockHeight) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Aave V3 rsETH User Data Query</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userAddress" className="block text-sm font-medium mb-1">
            User Address
          </label>
          <input
            type="text"
            id="userAddress"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground"
            placeholder="Enter user address"
            required
          />
        </div>
        <div>
          <label htmlFor="blockHeight" className="block text-sm font-medium mb-1">
            Block Height (optional)
          </label>
          <input
            type="number"
            id="blockHeight"
            value={blockHeight}
            onChange={(e) => setBlockHeight(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground"
            placeholder="Enter block height (optional)"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded transition duration-300 button-outline"
          style={{
            backgroundColor: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: '2px solid var(--button-outline)',
          }}
        >
          {isLoading ? 'Loading...' : 'Fetch User Data'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">User Reserve Data:</h2>
          <div className="space-y-2">
            <p><strong>Current aToken Balance:</strong> {response.formatted.currentATokenBalance}</p>
            {/* <p><strong>Current Stable Debt:</strong> {response.formatted.currentStableDebt}</p>
            <p><strong>Current Variable Debt:</strong> {response.formatted.currentVariableDebt}</p>
            <p><strong>Principal Stable Debt:</strong> {response.formatted.principalStableDebt}</p>
            <p><strong>Scaled Variable Debt:</strong> {response.formatted.scaledVariableDebt}</p>
            <p><strong>Stable Borrow Rate:</strong> {(parseFloat(response.formatted.stableBorrowRate) * 100).toFixed(2)}%</p>
            <p><strong>Liquidity Rate:</strong> {(parseFloat(response.formatted.liquidityRate) * 100).toFixed(2)}%</p>
            <p><strong>Stable Rate Last Updated:</strong> {response.stableRateLastUpdated}</p>
            <p><strong>Usage As Collateral Enabled:</strong> {response.usageAsCollateralEnabled ? 'Yes' : 'No'}</p> */}
          </div>
        </div>
      )}
    </main>
  );
};

export default KelpApiFrontend;