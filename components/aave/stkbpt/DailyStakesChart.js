import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailyStakesBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(row => row.day.value),
    datasets: [
      {
        label: 'BPTs Staked',
        data: data.map(row => row.num_bpts_staked ? parseFloat(row.num_bpts_staked.toString()) : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green color for stakes
      },
      {
        label: 'BPTs Unstaked',
        data: data.map(row => row.num_bpts_unstaked ? -parseFloat(row.num_bpts_unstaked.toString()) : 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red color for unstakes
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily BPTs Staked and Unstaked',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DailyStakesBarChart;