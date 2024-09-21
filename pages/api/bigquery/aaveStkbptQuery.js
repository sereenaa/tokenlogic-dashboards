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

  const { days, type } = req.query; // Get the number of days from the query parameters
  console.log(days)
  const numericDays = days ? parseInt(days.replace(/\D/g, ''), 10) : 30; // Extract numeric part and default to 30 if not provided
  console.log(numericDays)
  let limit;
  if (days === "all") { 
    limit = ''
  } else {
    limit = `limit ${days ? parseInt(days, 10) : 30}` // Default to 30 days if not provided
  }

  let query;
  switch (type) {
    case 'swapFeeApr':
      if (days === 'all') {
        query = `SELECT round(AVG(apr_from_swap_fees), 2) as average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\``;
      } else {
        query = `SELECT round(AVG(apr_from_swap_fees), 2) as average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\` WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${numericDays} DAY)`;
      }
      break;
    case 'emissionsApr':
      if (days === 'all') {
        query = `SELECT round(AVG(apr_from_emissions), 2) as average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\``;
      } else {
        query = `SELECT round(AVG(apr_from_emissions), 2) as average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\` WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${numericDays} DAY)`;
      }
      break;
    case 'totalLpApr':
      if (days === 'all') {
        query = `SELECT round(AVG(apr_from_swap_fees + apr_from_emissions), 2) AS average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\``;
      }
      else { 
        query = `SELECT round(AVG(apr_from_swap_fees + apr_from_emissions), 2) AS average FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\` WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL ${numericDays} DAY)`;
      }
      break;
    default:
      query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\` ORDER BY date DESC ${limit}`;
  }

  try {
    // const query = `select * from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr\` order by date desc ${limit}`;
    const [rows] = await bigquery.query({ query });
    if (type !== undefined) {
      console.log(rows);
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}