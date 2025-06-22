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

  const query = `
    SELECT DISTINCT symbol
    FROM \`datamart_common.defi_protocol_unlocks_by_day\`
    ORDER BY symbol ASC
  `;

  try {
    const [rows] = await bigquery.query({ query });
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching symbols from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching symbols from BigQuery' });
  }
} 