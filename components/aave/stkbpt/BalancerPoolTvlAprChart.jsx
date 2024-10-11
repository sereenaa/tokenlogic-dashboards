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
        label: 'Yield Bearing Tokens APR',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.yield_bearing_tokens_apr || 0,
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'APR',
      },
      {
        label: 'Swap Fees APR',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.swap_fees_apr || 0,
        })),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        stack: 'APR',
      },
      {
        label: 'Total APR',
        data: data.map(item => ({
          x: new Date(item.date.value),
          y: item.total_apr || 0,
        })),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        stack: 'APR',
      },
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
            if (context.dataset.label === 'TVL Pool') {
              return `TVL Pool: $${dataPoint.y.toLocaleString()}`;
            }
            return `${context.dataset.label}: ${(dataPoint.y * 100).toFixed(2)}%`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BalancerPoolTVLAPRChart;