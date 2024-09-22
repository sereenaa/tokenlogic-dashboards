import bigquery from '../../../utils/bigquery-client';

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

  let query;

  if (days === 'all') {
    query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\``;
  } else {
    const numericDays = parseInt(days, 10);
    query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\` order by block_hour desc limit ${numericDays}`;
  }

  try {
    console.log(query)
    const [rows] = await bigquery.query({ query });
    console.log(rows)
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}