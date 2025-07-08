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
    SELECT 
      protocol,
      token_symbol,
      start_time,
      end_time,
      perc_supply,
      value_usd,
      description,
      max_supply
    FROM \`tokenlogic-data-dev.datamart_common.defi_protocol_unlocks_table\`
    WHERE protocol = 'Morpho'
    ORDER BY start_time ASC
  `;

  try {
    const [rows] = await bigquery.query({ query });
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
} 