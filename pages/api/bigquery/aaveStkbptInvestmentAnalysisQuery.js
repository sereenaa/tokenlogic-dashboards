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

  const { days, type, frequency } = req.query; // Get the number of days from the query parameters
  console.log(days, type, frequency)

  let query;
  const numericDays = parseInt(days, 10);
  console.log(numericDays)
  let limitQuery;
  if (days === 'all') {
    limitQuery = '';
  } else {
    limitQuery = `limit ${numericDays}`;
  }

  if (type === 'data') {
    if (days === 'all') {
      query = `
        SELECT 
          block_hour
          , lp_user_total_value
          , lp_user_aave_value
          , lp_user_wsteth_value
          , lp_user_aave_token_balance
          , lp_user_wsteth_token_balance
          , non_lp_user_total_value
          , non_lp_user_aave_value
          , non_lp_user_wsteth_value
          , non_lp_user_aave_token_balance
          , non_lp_user_wsteth_token_balance
          , aave_usd_price
          , wsteth_usd_price
          , manual_il
        FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\`
      `;
    } else {
      query = `SELECT * FROM \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_investment_analysis\` order by block_hour desc limit ${numericDays}`;
    } 
  } else if (type === 'compounding') {
    if (frequency === '1d') {
      query = `
        select 
          date
          , user_usd_total_value_1_day as user_usd_total_value
          , aave_usd_value_1_day as aave_usd_value
          , wsteth_usd_value_1_day as wsteth_usd_value
          , aave_token_balance_1_day as aave_token_balance
          , wsteth_token_balance_1_day as wsteth_token_balance
        from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis\`
        order by date desc ${limitQuery}
      `;
    } else if (frequency === '7d') {
      query = `
        select 
          date
          , user_usd_total_value_7_days as user_usd_total_value
          , aave_usd_value_7_days as aave_usd_value
          , wsteth_usd_value_7_days as wsteth_usd_value
          , aave_token_balance_7_days as aave_token_balance
          , wsteth_token_balance_7_days as wsteth_token_balance
        from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis\`
        order by date desc ${limitQuery}
      `;
    } else if (frequency === '14d') {
      query = `
        select 
          date
          , user_usd_total_value_14_days as user_usd_total_value
          , aave_usd_value_14_days as aave_usd_value
          , wsteth_usd_value_14_days as wsteth_usd_value
          , aave_token_balance_14_days as aave_token_balance
          , wsteth_token_balance_14_days as wsteth_token_balance
        from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis\`
        order by date desc ${limitQuery}
      `;
    } else if (frequency === '30d') {
      query = `
        select 
          date
          , user_usd_total_value_30_days as user_usd_total_value
          , aave_usd_value_30_days as aave_usd_value
          , wsteth_usd_value_30_days as wsteth_usd_value
          , aave_token_balance_30_days as aave_token_balance
          , wsteth_token_balance_30_days as wsteth_token_balance
        from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis\`
        order by date desc ${limitQuery}
      `;
    } else if (frequency === '90d') {
      query = `
        select 
          date
          , user_usd_total_value_90_days as user_usd_total_value
          , aave_usd_value_90_days as aave_usd_value
          , wsteth_usd_value_90_days as wsteth_usd_value
          , aave_token_balance_90_days as aave_token_balance
          , wsteth_token_balance_90_days as wsteth_token_balance
        from \`tokenlogic-data-dev.datamart_aave.aave_stkbpt_compounding_analysis\`
        order by date desc ${limitQuery}
      `;
    }
  } else if (type === 'values') {
    query = `
      select 
        lp_user_aave_token_balance
        , aave_usd_price
        , user_lp_tokens
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

    if (type === 'compounding') {
      console.log(rows)
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}