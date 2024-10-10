import React from 'react';
import { Bar } from 'react-chartjs-2';

const BalancerPoolBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.day.value), // Extracting the day for labels
    datasets: [
      {
        label: 'AAVE Total Deposit Value',
        data: data.map(item => item.aave_total_deposit_value || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'AAVE Total Withdrawal Value',
        data: data.map(item => item.aave_total_withdrawal_value || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'wstETH Total Deposit Value',
        data: data.map(item => item.wstETH_total_deposit_value || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'wstETH Total Withdrawal Value',
        data: data.map(item => item.wstETH_total_withdrawal_value || 0),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true, // Ensure bars are grouped, not stacked
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const datasetLabel = context.dataset.label;
            const value = context.raw;
            const item = data[index];

            let breakdown = '';
            if (datasetLabel.includes('AAVE')) {
              breakdown = `AAVE Only Deposit: $${item.aave_only_deposit_value || 0}\nAAVE Only Withdrawal: $${item.aave_only_withdrawal_value || 0}`;
            } else if (datasetLabel.includes('wstETH')) {
              breakdown = `wstETH Only Deposit: $${item.wstETH_only_deposit_value || 0}\nwstETH Only Withdrawal: $${item.wstETH_only_withdrawal_value || 0}`;
            }

            return [
              `${datasetLabel}: $${value}`,
              breakdown
            ];
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default BalancerPoolBarChart;