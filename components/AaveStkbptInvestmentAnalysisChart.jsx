import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  PointElement
);


const AaveInvestmentAnalysisChart = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Get only the date part
  };

  const chartData = {
    labels: data.map(item => new Date(item.block_hour.value)),
    datasets: [
      {
        type: 'bar',
        label: "LP User's AAVE Token Value",
        data: data.map(item => ({
          x: formatDate(item.block_hour.value),
          y: item.lp_user_aave_value || 0,
          lp_user_total_value: item.lp_user_total_value,
          non_lp_user_total_value: item.non_lp_user_total_value,
          manual_il: item.manual_il,
          lp_user_aave_token_balance: item.lp_user_aave_token_balance,
          non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
          aave_usd_price: item.aave_usd_price,
          lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
          non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
          wsteth_usd_price: item.wsteth_usd_price,
        })),
        backgroundColor: '#E68A9A',
        barThickness: 'flex',
        maxBarThickness: 20,
      },
      {
        type: 'bar',
        label: "LP User's wstETH Token Value",
        data: data.map(item => ({
          x: formatDate(item.block_hour.value),
          y: item.lp_user_wsteth_value || 0,
          lp_user_total_value: item.lp_user_total_value,
          non_lp_user_total_value: item.non_lp_user_total_value,
          manual_il: item.manual_il,
          lp_user_aave_token_balance: item.lp_user_aave_token_balance,
          non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
          aave_usd_price: item.aave_usd_price,
          lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
          non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
          wsteth_usd_price: item.wsteth_usd_price,
        })),
        backgroundColor: '#F7C77A', // Light orange
        barThickness: 'flex',
        maxBarThickness: 20,
      },
      {
        type: 'line',
        label: "Non-LP User's AAVE Token Value",
        data: data.map(item => ({
          x: new Date(item.block_hour.value),
          y: item.non_lp_user_aave_value || 0,
          lp_user_total_value: item.lp_user_total_value,
          non_lp_user_total_value: item.non_lp_user_total_value,
          manual_il: item.manual_il,
          lp_user_aave_token_balance: item.lp_user_aave_token_balance,
          non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
          aave_usd_price: item.aave_usd_price,
          lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
          non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
          wsteth_usd_price: item.wsteth_usd_price,
        })),
        borderColor: '#CD506A', // Dark green
        backgroundColor: '#CD506A',
        fill: false,
        pointRadius: 0, // Remove dots
      },
      {
        type: 'line',
        label: "Non-LP User's wstETH Token Value",
        data: data.map(item => ({
          x: new Date(item.block_hour.value),
          y: item.non_lp_user_wsteth_value || 0,
          lp_user_total_value: item.lp_user_total_value,
          non_lp_user_total_value: item.non_lp_user_total_value,
          manual_il: item.manual_il,
          lp_user_aave_token_balance: item.lp_user_aave_token_balance,
          non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
          aave_usd_price: item.aave_usd_price,
          lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
          non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
          wsteth_usd_price: item.wsteth_usd_price,
        })),
        borderColor: '#F2A740', // Dark orange
        backgroundColor: '#F2A740',
        fill: false,
        pointRadius: 0, // Remove dots
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value (USD)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(context[0].raw.x).toLocaleDateString(undefined, dateOptions);
          },
          label: (context) => {
            const dataPoint = context.raw;
            return [
              `Value: $${dataPoint.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `AAVE Token Price: $${dataPoint.aave_usd_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `wstETH Token Price: $${dataPoint.wsteth_usd_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `LP User Total Value: $${dataPoint.lp_user_total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `LP User AAVE Tokens: ${dataPoint.lp_user_aave_token_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `LP User wstETH Tokens: ${dataPoint.lp_user_wsteth_token_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Non-LP User Total Value: $${dataPoint.non_lp_user_total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Non-LP User AAVE Tokens: ${dataPoint.non_lp_user_aave_token_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Non-LP User wstETH Tokens: ${dataPoint.non_lp_user_wsteth_token_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              `Impermanent Loss: ${dataPoint.manual_il.toFixed(2)}%`,
            ];
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AaveInvestmentAnalysisChart;