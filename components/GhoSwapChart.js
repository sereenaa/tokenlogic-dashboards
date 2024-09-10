import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

const GHOSwapChart = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'GHO Buy',
        data: data.filter(item => item.gho_buysell === 'buy').map(item => ({
          x: new Date(item.block_timestamp.value),
          y: item.gho_swapped || 0,
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'GHO Sell',
        data: data.filter(item => item.gho_buysell === 'sell').map(item => ({
          x: new Date(item.block_timestamp.value),
          y: item.gho_swapped || 0,
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
          unit: 'hour',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'GHO Amount Swapped',
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = context.raw;
            return [
              `Time: ${dataPoint.x.toLocaleString()}`,
              `Amount: ${dataPoint.y.toLocaleString()} GHO`,
              `Price: $${context.dataset.data[context.dataIndex].gho_price_usd?.toFixed(4) || 'N/A'}`,
            ];
          },
        },
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default GHOSwapChart;