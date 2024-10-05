import React, { useState, useEffect } from 'react';

const AaveDash4 = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery/aave/stkbpt/claims');
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={`container mx-auto p-4 bg-background text-foreground ${className}`}>
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT Average Duration Between Claims</h1>
      <div className="flex flex-col items-left">
        <table>
          <thead>
            <tr>
              <th className="py-1 text-left">Average Duration (hours)</th>
              <th className="py-1 text-left">Average Duration Top 20 LPs (hours)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.avg_duration.toFixed(2)}</td>
                <td>{row.avg_duration_top_20_lps.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AaveDash4;