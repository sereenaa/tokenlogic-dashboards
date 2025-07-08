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
  Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const TokenUnlockScheduleChart = ({ data }) => {
  // Process data to create time series for cumulative unlocks
  const processUnlockData = (rawData) => {

    
    // Get all unique dates (start and end times)
    const allDates = new Set();
    
    rawData.forEach(item => {
      // Handle BigQuery date format (might have .value property)
      const startTime = item.start_time?.value || item.start_time;
      const endTime = item.end_time?.value || item.end_time;
      
      if (startTime && startTime !== 'TBD') {
        allDates.add(new Date(startTime).getTime());
      }
      if (endTime && endTime !== 'TBD') {
        allDates.add(new Date(endTime).getTime());
      }
    });
    
    // Add some buffer dates for better visualization
    const sortedDates = Array.from(allDates).sort((a, b) => a - b);

    
    if (sortedDates.length > 0) {
      // Add 6 months before first date
      const firstDate = new Date(sortedDates[0]);
      firstDate.setMonth(firstDate.getMonth() - 6);
      allDates.add(firstDate.getTime());
      
      // Add 6 months after last date
      const lastDate = new Date(sortedDates[sortedDates.length - 1]);
      lastDate.setMonth(lastDate.getMonth() + 6);
      allDates.add(lastDate.getTime());
    } else {
      // If no dates found, add some default range
      const now = new Date();
      const start = new Date('2022-01-01');
      const end = new Date('2030-01-01');
      allDates.add(start.getTime());
      allDates.add(now.getTime());
      allDates.add(end.getTime());
    }
    
    const timePoints = Array.from(allDates).sort((a, b) => a - b).map(time => new Date(time));
    
    // Calculate cumulative unlocks at each time point
    const datasets = [];
    
    // Group items by description for better visualization
    const generateCategoryFromDescription = (description) => {
      if (description.includes('DAO')) return 'dao_reserve';
      if (description.includes('Association')) return 'association_reserve';
      if (description.includes('contributors') && description.includes('Reserve')) return 'contributor_reserve';
      if (description.includes('Users') || description.includes('TGE')) return 'tge_available';
      if (description.includes('Early contributors')) return 'early_contributors';
      if (description.includes('Cohort 1')) return 'cohort_1';
      if (description.includes('Cohort 2')) return 'cohort_2';
      if (description.includes('Founders')) return 'founders';
      if (description.includes('Cohort 3')) return 'cohort_3';
      return 'other';
    };

    const categoryColors = {
      'dao_reserve': 'rgba(255, 99, 132, 0.8)',
      'association_reserve': 'rgba(54, 162, 235, 0.8)', 
      'contributor_reserve': 'rgba(75, 192, 192, 0.8)',
      'tge_available': 'rgba(255, 206, 86, 0.8)',
      'early_contributors': 'rgba(153, 102, 255, 0.8)',
      'cohort_1': 'rgba(255, 159, 64, 0.8)',
      'cohort_2': 'rgba(199, 199, 199, 0.8)',
      'founders': 'rgba(83, 102, 255, 0.8)',
      'cohort_3': 'rgba(255, 99, 255, 0.8)',
      'other': 'rgba(128, 128, 128, 0.8)'
    };
    
    const categoryLabels = {
      'dao_reserve': 'Morpho DAO',
      'association_reserve': 'Association Reserve',
      'contributor_reserve': 'Contributor Reserve', 
      'tge_available': 'TGE Available',
      'early_contributors': 'Early Contributors',
      'cohort_1': 'Cohort 1',
      'cohort_2': 'Cohort 2',
      'founders': 'Founders',
      'cohort_3': 'Cohort 3',
      'other': 'Other'
    };
    
    // Add max_supply to each item and generate categories
    const dataWithCategories = rawData.map(item => ({
      ...item,
      category: generateCategoryFromDescription(item.description)
    }));

    // Process each category
    Object.keys(categoryColors).forEach((category, index) => {
      const categoryItems = dataWithCategories.filter(item => item.category === category);
      
      if (categoryItems.length === 0) return;
      

      
      const dataPoints = timePoints.map(date => {
        let cumulativeUnlocked = 0;
        
        categoryItems.forEach(item => {
          // Handle BigQuery date format
          const startTime = item.start_time?.value || item.start_time;
          const endTime = item.end_time?.value || item.end_time;
          
          if (!startTime || !endTime || startTime === 'TBD' || endTime === 'TBD') {
            // Items without dates are considered locked/reserved (not unlocked)
            return;
          }
          
          const startDate = new Date(startTime);
          const endDate = new Date(endTime);
          
          if (date < startDate) {
            // Before unlock starts
            return;
          } else if (date >= endDate) {
            // After unlock completes
            cumulativeUnlocked += item.perc_supply;
          } else {
            // During unlock period - linear vesting
            const totalDuration = endDate.getTime() - startDate.getTime();
            const elapsedDuration = date.getTime() - startDate.getTime();
            const vestingProgress = elapsedDuration / totalDuration;
            cumulativeUnlocked += item.perc_supply * vestingProgress;
          }
        });
        
        return {
          x: date,
          y: cumulativeUnlocked * 100, // Convert to percentage
        };
      });
      
      datasets.push({
        label: categoryLabels[category] || category,
        data: dataPoints,
        backgroundColor: categoryColors[category],
        borderColor: categoryColors[category].replace('0.8', '1'),
        borderWidth: 2,
        fill: index === 0 ? 'origin' : '-1',
        tension: 0.1,
        pointRadius: 0,
      });
    });
    
    return { timePoints, datasets };
  };
  
  const { timePoints, datasets } = processUnlockData(data);
  
  const chartData = {
    labels: timePoints,
    datasets: datasets,
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    backgroundColor: '#000000',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          color: '#e5e7eb', // Light gray for dark mode
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateValue = new Date(context[0].parsed.x);
            return dateValue.toLocaleDateString(undefined, dateOptions);
          },
          label: (context) => {
            const value = context.parsed.y;
            const dataPoint = context.raw;
            const maxSupply = data.length > 0 ? data[0].max_supply : null;
            const tokensUnlocked = maxSupply ? (value / 100 * maxSupply).toLocaleString() : 'N/A';
            return [
              `${context.dataset.label}: ${value.toFixed(2)}%`,
              `Tokens: ${tokensUnlocked} MORPHO`
            ];
          },
          afterBody: (context) => {
            const totalUnlocked = context.reduce((sum, item) => sum + item.parsed.y, 0);
            const maxSupply = data.length > 0 ? data[0].max_supply : null;
            const totalTokensUnlocked = maxSupply ? (totalUnlocked / 100 * maxSupply).toLocaleString() : 'N/A';
            return [
              `Total Unlocked: ${totalUnlocked.toFixed(2)}%`,
              `Total Tokens: ${totalTokensUnlocked} MORPHO`,
              maxSupply ? `Max Supply: ${maxSupply.toLocaleString()} MORPHO` : ''
            ].filter(Boolean);
          }
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
        },
        title: {
          display: true,
          text: 'Date',
          color: '#e5e7eb',
        },
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#333333',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Cumulative Supply Unlocked (%)',
          color: '#e5e7eb',
        },
        min: 0,
        max: 100,
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: '#333333',
        },
      },
    },
    elements: {
      point: {
        backgroundColor: '#000000',
      }
    },
  };
  
  return <Line data={chartData} options={options} />;
};

export default TokenUnlockScheduleChart; 