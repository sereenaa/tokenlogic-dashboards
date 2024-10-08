import React, { useState, useEffect } from 'react';
import DailyStakesBarChart from './DailyStakesChart';

const AaveDash5 = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bigquery/aave/stkbpt/stakes');
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
      <h1 className="text-2xl font-bold mb-4">AAVE stkBPT Daily Stakes and Unstakes</h1>
      <DailyStakesBarChart data={data} />
    </main>
  );
};

export default AaveDash5;