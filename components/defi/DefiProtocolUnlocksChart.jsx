import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

const DefiProtocolUnlocksChart = ({ data, selectedSymbol }) => {
  // Define colors for different symbols
  const symbolColors = [
    { border: 'rgba(255, 99, 132, 1)', fill: 'rgba(255, 99, 132, 0.1)' },
    { border: 'rgba(54, 162, 235, 1)', fill: 'rgba(54, 162, 235, 0.1)' },
    { border: 'rgba(75, 192, 192, 1)', fill: 'rgba(75, 192, 192, 0.1)' },
    { border: 'rgba(255, 206, 86, 1)', fill: 'rgba(255, 206, 86, 0.1)' },
    { border: 'rgba(153, 102, 255, 1)', fill: 'rgba(153, 102, 255, 0.1)' },
    { border: 'rgba(255, 159, 64, 1)', fill: 'rgba(255, 159, 64, 0.1)' },
    { border: 'rgba(199, 199, 199, 1)', fill: 'rgba(199, 199, 199, 0.1)' },
    { border: 'rgba(83, 102, 255, 1)', fill: 'rgba(83, 102, 255, 0.1)' },
  ];

  let chartData;

  if (selectedSymbol && selectedSymbol !== 'all') {
    // Single symbol selected - show total supply and circulating supply for that symbol
    const filteredData = data.filter(item => item.symbol === selectedSymbol);
    
    chartData = {
      labels: filteredData.map(item => new Date(item.block_day.value)),
      datasets: [
        {
          label: `${selectedSymbol} - Fully Diluted Value (FDV) USD`,
          data: filteredData.map(item => ({
            x: new Date(item.block_day.value),
            y: parseFloat(item.fdv_usd) || 0,
          })),
          borderColor: symbolColors[0].border,
          backgroundColor: symbolColors[0].fill,
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
        {
          label: `${selectedSymbol} - Circulating Supply USD`,
          data: filteredData.map(item => ({
            x: new Date(item.block_day.value),
            y: parseFloat(item.circulating_supply_usd) || 0,
          })),
          borderColor: symbolColors[1].border,
          backgroundColor: symbolColors[1].fill,
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
      ],
    };
  } else {
    // All symbols selected - create separate datasets for each symbol
    const symbols = [...new Set(data.map(item => item.symbol))];
    
    const datasets = [];
    
    symbols.forEach((symbol, index) => {
      const symbolData = data.filter(item => item.symbol === symbol);
      const colorIndex = index % symbolColors.length;
      
      // Add total supply dataset for this symbol
      datasets.push({
        label: `${symbol} - Fully Diluted Value (FDV) USD`,
        data: symbolData.map(item => ({
          x: new Date(item.block_day.value),
          y: parseFloat(item.fdv_usd) || 0,
        })),
        borderColor: symbolColors[colorIndex].border,
        backgroundColor: symbolColors[colorIndex].fill,
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      });
      
      // Add circulating supply dataset for this symbol
      datasets.push({
        label: `${symbol} - Circulating Supply USD`,
        data: symbolData.map(item => ({
          x: new Date(item.block_day.value),
          y: parseFloat(item.circulating_supply_usd) || 0,
        })),
        borderColor: symbolColors[colorIndex].border,
        backgroundColor: symbolColors[colorIndex].fill,
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        borderDash: [5, 5], // Dashed line for circulating supply
      });
    });
    
    chartData = {
      labels: data.map(item => new Date(item.block_day.value)),
      datasets: datasets,
    };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
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
          text: 'Amount (USD)',
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
            return `${label}: ${dataPoint.y.toLocaleString()}`;
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DefiProtocolUnlocksChart; 