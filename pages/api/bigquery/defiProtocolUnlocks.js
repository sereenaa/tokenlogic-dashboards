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

  const { symbol } = req.query; // Get the symbol from query parameters

  let query;
  if (symbol && symbol !== 'all') {
    query = `
      SELECT 
        block_day,
        symbol,
        fdv_usd,
        circulating_supply_usd
      FROM \`datamart_common.defi_protocol_unlocks_by_day\`
      WHERE symbol = '${symbol}'
      ORDER BY block_day ASC
    `;
  } else {
    query = `
      SELECT 
        block_day,
        symbol,
        fdv_usd,
        circulating_supply_usd
      FROM \`datamart_common.defi_protocol_unlocks_by_day\`
      ORDER BY block_day ASC
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