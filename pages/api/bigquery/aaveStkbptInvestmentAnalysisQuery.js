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
  console.log(days, type)

  let query;

  if (type === 'data') {
    if (days === 'all') {
      query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\``;
    } else {
      const numericDays = parseInt(days, 10);
      query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\` order by block_hour desc limit ${numericDays}`;
    } 
  } else if (type === 'values') {
    query = `
      select 
        lp_user_aave_token_balance
        , aave_usd_price
        , lp_user_aave_token_balance * aave_usd_price as lp_user_aave_token_value
        , lp_user_wsteth_token_balance
        , wsteth_usd_price
        , lp_user_wsteth_token_balance * wsteth_usd_price as lp_user_wsteth_token_value
        , non_lp_user_aave_token_balance
        , non_lp_user_wsteth_token_balance
      from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\`
      where block_hour = (select max(block_hour) from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\`)
        or block_hour = (select min(block_hour) from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\`)
      order by block_hour
    `
  }

  try {
    console.log(query)
    const [rows] = await bigquery.query({ query });
    if (type === 'values') {
      console.log(rows)
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}