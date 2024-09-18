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

const AaveAPRChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date.value)),
    datasets: [
      {
        label: 'APR from Emissions',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.apr_from_emissions || 0,
          tvl_pool: item.tvl_pool,
          tvs: item.tvs,
          usd_swap_volume_per_day: item.usd_swap_volume_per_day,
          swap_fee: item.swap_fee,
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.9)',
        // borderRadius: 10, // Add this line to make the bars rounded
        // borderSkipped: false, // Add this line to round both top and bottom
      },
      {
        label: 'APR from Swap Fees',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.apr_from_swap_fees || 0,
          tvl_pool: item.tvl_pool,
          tvs: item.tvs,
          usd_swap_volume_per_day: item.usd_swap_volume_per_day,
          swap_fee: item.swap_fee,
        })),
        backgroundColor: 'rgba(153, 125, 265, 0.9)',
        // borderRadius: 10,
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
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + '%';
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
            return [
              `APR: ${dataPoint.y.toFixed(2)}%`,
              `TVL Pool: $${dataPoint.tvl_pool.toLocaleString()}`,
              `Total Value Staked: $${dataPoint.tvs.toLocaleString()}`,
              `USD Swap Volume/Day: $${dataPoint.usd_swap_volume_per_day.toLocaleString()}`,
              `Swap Fee: ${(dataPoint.swap_fee * 100).toFixed(2)}%`,
            ];
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AaveAPRChart;