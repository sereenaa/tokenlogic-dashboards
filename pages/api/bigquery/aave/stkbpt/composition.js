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

  const { topLps, type } = req.query; // Get the number of top LPs from the query parameters
  const numericTopLps = parseInt(topLps, 10);

  let query;
  if (type === 'all' || topLps === 'all') {
    query = `
      SELECT 
        address,
        num_stk_lp_tokens,
        total_num_stk_lp_tokens,
        perc
      FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_composition\`
      ORDER BY perc DESC
    `;
  } else {
    query = `
      SELECT 
        address,
        num_stk_lp_tokens,
        total_num_stk_lp_tokens,
        perc
      FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_composition\`
      ORDER BY perc DESC
      LIMIT ${numericTopLps}
    `;
  }

  try {
    const [rows] = await bigquery.query({ query });
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}