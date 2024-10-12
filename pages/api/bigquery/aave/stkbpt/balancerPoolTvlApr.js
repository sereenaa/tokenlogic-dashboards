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

  const { days, type } = req.query; // Get the number of days from the query parameters
  const numericDays = parseInt(days, 10);
  console.log(numericDays)

  let query; 
  if (type === 'avgYields') {
    if (days === 'all') {
      query = `select 
        round(avg(interest_bearing_token_yield)*100, 2) as average_ib_yield
        , round(avg(swap_fee_yield)*100, 2) as average_swap_fee_yield
        , round(avg(aave_emissions_yield)*100, 2) as average_aave_emissions_yield 
        , round(avg(total_yield)*100, 2) as average_total_yield
      from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr;`
    } else {
      query = `select 
        round(avg(interest_bearing_token_yield)*100, 2) as average_ib_yield
        , round(avg(swap_fee_yield)*100, 2) as average_swap_fee_yield
        , round(avg(aave_emissions_yield)*100, 2) as average_aave_emissions_yield 
        , round(avg(total_yield)*100, 2) as average_total_yield
      from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr
      where date >= date_sub(current_date(), interval ${numericDays} day);`
    }
  } else { 
    if (days === 'all') {
      query = `select * from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr order by date;`;
    } else {
      query = `
      select * from (
        select * from tokenlogic-data-dev.datamart_aave.aave_stkbpt_apr order by date desc limit ${numericDays}
      ) order by date;`;
    }
  }

  try {
    const [rows] = await bigquery.query({ query });
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from BigQuery:', error);
    res.status(500).json({ error: 'Error fetching data from BigQuery' });
  }
}