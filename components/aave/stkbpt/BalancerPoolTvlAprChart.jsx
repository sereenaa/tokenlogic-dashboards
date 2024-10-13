import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TimeScale
);

const BalancerPoolTVLAPRChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date.value)),
    datasets: [
      {
        label: 'TVL Pool',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.tvl_pool || 0,
        })),
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Total Value Staked',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.tvs || 0,
        })),
        type: 'line',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Interest Bearing Token Yield',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.interest_bearing_token_yield || 0,
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'APR',
      },
      {
        label: 'Swap Fee Yield',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.swap_fee_yield || 0,
        })),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        stack: 'APR',
      },
      {
        label: 'Aave Emissions Yield',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.aave_emissions_yield || 0,
        })),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        stack: 'APR',
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
          text: 'APR (%)',
        },
        stacked: false,
        ticks: {
          callback: function(value) {
            return (value * 100).toFixed(2) + '%';
          }
        }
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'TVL Pool ($)',
        },
        grid: {
          drawOnChartArea: false,
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
            return context[0].raw.x.toLocaleDateString(undefined, dateOptions);
          },
          label: (context) => {
            const dataPoint = context.raw;
            const label = context.dataset.label;
            if (context.dataset.label === 'TVL Pool') {
              return `TVL Pool: $${dataPoint.y.toLocaleString()}`;
            }
            // return `${context.dataset.label}: ${(dataPoint.y * 100).toFixed(2)}%`;
            return `${label}: ${(dataPoint.y * 100).toFixed(2)}%`;
          },
          afterLabel: (context) => {
            const item = data[context.dataIndex];
            return [
              `TVL Pool: $${item.tvl_pool.toLocaleString()}`,
              `Total Value Staked: $${item.tvs.toLocaleString()}`,
              `wstETH Balance Pool: ${item.wstETH_balance_pool.toFixed(2)}`,
              `wstETH Balance Stk: ${item.wstETH_balance_stk.toFixed(2)}`,
              `wstETH Price: $${item.wstETH_price.toLocaleString()}`,
              `Aave Balance: ${item.aave_balance.toFixed(2)}`,
              `Aave Balance Stk: ${item.aave_balance_stk.toFixed(2)}`,
              `Aave Price: $${item.aave_price.toLocaleString()}`,
              `USD Swap Volume/Day: $${item.usd_swap_volume_per_day.toLocaleString()}`,
            ];
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BalancerPoolTVLAPRChart;