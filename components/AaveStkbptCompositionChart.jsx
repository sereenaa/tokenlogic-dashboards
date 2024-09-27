import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AaveCompositionChart = ({ data }) => {
  const topAddresses = data.map(item => item.address);
  console.log('Top Addresses:', topAddresses);

  const topPercentages = data.map(item => {
    const perc = parseFloat(item.perc);
    return isNaN(perc) ? 0 : perc;
  });
  console.log('Top Percentages:', topPercentages);

  const totalPercentage = topPercentages.reduce((acc, perc) => acc + perc, 0);
  console.log('Total Percentage:', totalPercentage);

  const otherPercentage = 100 - totalPercentage;
  console.log('Other Percentage:', otherPercentage);


  const chartData = {
    labels: [...topAddresses, 'Other'],
    datasets: [
      {
        label: 'Percentage of Total LP Tokens',
        data: [...topPercentages, otherPercentage],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
          '#FF9F40', '#B39DDB', '#8E24AA', '#D4E157', '#FF7043', 
          '#26A69A', '#EF5350', '#AB47BC', '#42A5F5', '#7E57C2', 
          '#66BB6A', '#FFCA28', '#29B6F6', '#FFEB3B', '#8D6E63', 
          '#78909C'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
          '#FF9F40', '#B39DDB', '#8E24AA', '#D4E157', '#FF7043', 
          '#26A69A', '#EF5350', '#AB47BC', '#42A5F5', '#7E57C2', 
          '#66BB6A', '#FFCA28', '#29B6F6', '#FFEB3B', '#8D6E63', 
          '#78909C'
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right', // Position the legend on the right side
      },
    },
    maintainAspectRatio: false, // Allow custom width and height
  };

  return (
    <div style={{ width: '1200px', height: '400px' }} className="mb-4"> 
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AaveCompositionChart;