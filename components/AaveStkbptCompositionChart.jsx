import React, { useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AaveCompositionChart = ({ data }) => {
  const chartRef = useRef(null);

  const topAddresses = data.map(item => item.address);
  console.log('Top Addresses:', topAddresses);

  const topPercentages = data.map(item => {
    const perc = parseFloat(item.perc);
    return isNaN(perc) ? 0 : perc;
  });
  console.log('Top Percentages:', topPercentages);

  const totalPercentage = topPercentages.reduce((acc, perc) => acc + perc, 0);
  console.log('Total Percentage:', totalPercentage);

  let otherPercentage = 100 - totalPercentage;
  if (otherPercentage <= 0) {
    otherPercentage = 0;
  }
  console.log('Other Percentage:', otherPercentage);

  const chartData = {
    labels: otherPercentage > 0 ? [...topAddresses, 'Other'] : topAddresses,
    datasets: [
      {
        label: 'Percentage of Total LP Tokens',
        data: otherPercentage > 0 ? [...topPercentages, otherPercentage] : topPercentages,
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
        display: false, // Disable the default legend
      },
    },
    maintainAspectRatio: false, // Allow custom width and height
  };

  const generateCustomLegend = (chart) => {
    const { labels } = chart.data;
    const { backgroundColor } = chart.data.datasets[0];
    return labels.map((label, index) => (
      `<li className="text-table" key="${index}"">
        <span className="text-table" style="background-color:${backgroundColor[index]}; width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></span>
        ${label}
      </li>`
    )).join('');
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const legendContainer = document.getElementById('legend-container');
      legendContainer.innerHTML = `<ul>${generateCustomLegend(chart)}</ul>`;
    }
  }, [chartData]);

  return (
    <div className="flex justify-center items-center mb-20">
      <div style={{ width: '400px', height: '400px' }}> 
        <Pie ref={chartRef} data={chartData} options={options} />
      </div>
      <div id="legend-container" className="text-table" style={{ maxHeight: '400px', overflowY: 'scroll', marginLeft: '20px', fontFamily: 'inherit' }}></div>
    </div>
  );
};

export default AaveCompositionChart;