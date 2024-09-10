import { BigQuery } from '@google-cloud/bigquery';

let bigquery;

try {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const config = {
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  };

  if (isProduction) {
    // For production (Vercel deployment)
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    config.credentials = credentials;
  } else {
    // For local development
    config.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  bigquery = new BigQuery(config);
  console.log(`BigQuery client initialized in ${isProduction ? 'production' : 'development'} mode`);
} catch (error) {
  console.error('Error initializing BigQuery client:', error);
}

export default bigquery;