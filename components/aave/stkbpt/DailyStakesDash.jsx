import React, { useState, useEffect } from 'react';
import DailyStakesBarChart from './DailyStakesChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AaveDash5 = ({ className }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuery, setShowQuery] = useState(false); // New state for toggling SQL query

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
      <div className="flex items-center mt-4">
        <FontAwesomeIcon
          icon={showQuery ? faChevronDown : faChevronRight}
          className="mr-2 cursor-pointer"
          onClick={() => setShowQuery(!showQuery)}
        />
        <em onClick={() => setShowQuery(!showQuery)} className="cursor-pointer">
          Table: tokenlogic-data-dev.datamart_aave.aave_stkbpt_daily_stakes
        </em>
      </div>
      {showQuery && (
        <div className="mt-4 p-4 rounded bg-light-background">
          <pre>
            <code>
              {`select * from tokenlogic-data-dev.datamart_aave.aave_stkbpt_daily_stakes;`}
            </code>
          </pre>
        </div>
      )}
    </main>
  );
};

export default AaveDash5;