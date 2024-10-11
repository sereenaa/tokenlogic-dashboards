import bigquery from '../../../../../utils/bigquery-client';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { days } = req.query; // Get the number of days from the query parameters
  const numericDays = parseInt(days, 10);
  console.log(numericDays)

  let query; 
  if (days === 'all') {
    query = `select * from tokenlogic-data-dev.datamart_aave.aave_balancer_pool_20wsteth_80aave_tvl_apr order by date`;
  } else {
    query = `
    select * from (
      select * from tokenlogic-data-dev.datamart_aave.aave_balancer_pool_20wsteth_80aave_tvl_apr order by date desc limit ${numericDays}
    ) order by date`;
  }

  try {
    const [rows] = await bigquery.query({ query });
    console.log(rows)
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}