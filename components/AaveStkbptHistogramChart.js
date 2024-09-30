import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AaveStkbptHistogramChart = ({ data }) => {
  // Group data into bins
  const binSize = 0.1; // 1% bin size
  const maxPercentage = 100;
  const bins = Array.from({ length: maxPercentage / binSize }, (_, i) => ({
    range: `${(i * binSize).toFixed(1)}-${((i + 1) * binSize).toFixed(1)}`,
    count: 0,
  }));

  data.forEach(item => {
    const perc = parseFloat(item.perc);
    const binIndex = Math.floor(perc / binSize);
    if (binIndex < bins.length) {
      bins[binIndex].count += 1;
    }
  });

  // Filter out bins with a count of zero
  const filteredBins = bins.filter(bin => bin.count > 0);

  // // Find the maximum bin index with a count greater than zero
  // const maxBinIndex = bins.reduce((maxIndex, bin, index) => {
  //   return bin.count > 0 ? index : maxIndex;
  // }, 0);
  // // Slice the bins array up to the maximum bin index
  // const filteredBins = bins.slice(0, maxBinIndex + 1);

  const histogramData = {
    labels: filteredBins.map(bin => bin.range),
    datasets: [
      {
        label: 'Number of Staked LP Token Holders',
        data: filteredBins.map(bin => bin.count),
        backgroundColor: '#00008B',
      },
    ],
  };

  const histogramOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Percentage of Total LP Tokens (%)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Holders',
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the default legend
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataPoint = context.raw;
            return `Number of Holders: ${dataPoint}`;
          },
        },
      },
    },
    maintainAspectRatio: false, // Allow custom width and height
  };

  return (
    <div style={{ width: '80vw', height: '80vh' }}>
      <Bar data={histogramData} options={histogramOptions} />
    </div>
  );
};

export default AaveStkbptHistogramChart;