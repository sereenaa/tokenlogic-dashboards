import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LineController,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LineController,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  PointElement
);


const AaveInvestmentAnalysisChart = ({ data, compoundingData }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Get only the date part
  };

  const chartData = {
    labels: data.map(item => new Date(item.block_hour.value)),
    datasets: [
      {
        type: 'line',
        label: "LP User Total Value",
        data: data.map(item => ({
          x: formatDate(item.block_hour.value), // Match x value with bar dataset
          y: item.lp_user_total_value || 0,
        })),
        borderColor: '#5AB379', 
        backgroundColor: '#5AB379',
        fill: false,
        pointRadius: 0, // Remove dots
        borderWidth: 2, // Thinner line
      },
      {
        type: 'line',
        label: "Non-LP User Total Value",
        data: data.map(item => ({
          x: formatDate(item.block_hour.value), // Match x value with bar dataset
          y: item.non_lp_user_total_value || 0,
        })),
        borderColor: '#2654B8', // Orange
        backgroundColor: '#2654B8',
        fill: false,
        pointRadius: 0, // Remove dots
        borderWidth: 2, // Thinner line
      },
      ...(showBreakdown ? [
        {
          type: 'bar',
          label: "LP User's AAVE Token Value",
          data: data.map(item => ({
            x: formatDate(item.block_hour.value),
            y: item.lp_user_aave_value || 0,
            lp_user_total_value: item.lp_user_total_value,
            non_lp_user_total_value: item.non_lp_user_total_value,
            manual_il: item.manual_il,
            lp_user_aave_token_balance: item.lp_user_aave_token_balance,
            non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
            aave_usd_price: item.aave_usd_price,
            lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
            non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
            wsteth_usd_price: item.wsteth_usd_price,
          })),
          backgroundColor: '#E68A9A',
          barThickness: 'flex',
          maxBarThickness: 20,
        },
        {
          type: 'bar',
          label: "LP User's wstETH Token Value",
          data: data.map(item => ({
            x: formatDate(item.block_hour.value),
            y: item.lp_user_wsteth_value || 0,
            lp_user_total_value: item.lp_user_total_value,
            non_lp_user_total_value: item.non_lp_user_total_value,
            manual_il: item.manual_il,
            lp_user_aave_token_balance: item.lp_user_aave_token_balance,
            non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
            aave_usd_price: item.aave_usd_price,
            lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
            non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
            wsteth_usd_price: item.wsteth_usd_price,
          })),
          backgroundColor: '#F7C77A', // Light orange
          barThickness: 'flex',
          maxBarThickness: 20,
        },
        {
          type: 'line',
          label: "Non-LP User's AAVE Token Value",
          data: data.map(item => ({
            x: formatDate(item.block_hour.value), // Match x value with bar dataset
            y: item.non_lp_user_aave_value || 0,
            lp_user_total_value: item.lp_user_total_value,
            non_lp_user_total_value: item.non_lp_user_total_value,
            manual_il: item.manual_il,
            lp_user_aave_token_balance: item.lp_user_aave_token_balance,
            non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
            aave_usd_price: item.aave_usd_price,
            lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
            non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
            wsteth_usd_price: item.wsteth_usd_price,
          })),
          borderColor: '#CD506A', // Dark green
          backgroundColor: '#CD506A',
          fill: false,
          pointRadius: 0, // Remove dots
          borderWidth: 2, // Thinner line
        },
        {
          type: 'line',
          label: "Non-LP User's wstETH Token Value",
          data: data.map(item => ({
            x: formatDate(item.block_hour.value), // Match x value with bar dataset
            y: item.non_lp_user_wsteth_value || 0,
            lp_user_total_value: item.lp_user_total_value,
            non_lp_user_total_value: item.non_lp_user_total_value,
            manual_il: item.manual_il,
            lp_user_aave_token_balance: item.lp_user_aave_token_balance,
            non_lp_user_aave_token_balance: item.non_lp_user_aave_token_balance,
            aave_usd_price: item.aave_usd_price,
            lp_user_wsteth_token_balance: item.lp_user_wsteth_token_balance,
            non_lp_user_wsteth_token_balance: item.non_lp_user_wsteth_token_balance,
            wsteth_usd_price: item.wsteth_usd_price,
          })),
          borderColor: '#F2A740', // Dark orange
          backgroundColor: '#F2A740',
          fill: false,
          pointRadius: 0, // Remove dots
          borderWidth: 2, // Thinner line
        },
      ] : []),
      ...(compoundingData.length > 0 ? [
        {
          type: 'line',
          label: "Compounded Total Value",
          data: compoundingData.map(item => ({
            x: formatDate(item.date.value),
            y: item.user_usd_total_value || 0, // Adjust based on frequency
          })),
          borderColor: '#FF5733', // Different color for compounded data
          backgroundColor: '#FF5733',
          fill: false,
          pointRadius: 0, // Remove dots
          borderWidth: 2, // Thinner line
        },
        {
          type: 'bar',
          label: "Compounded AAVE Value",
          data: compoundingData.map(item => ({
            x: formatDate(item.date.value),
            y: item.aave_usd_value || 0, // Adjust based on frequency
          })),
          backgroundColor: 'rgba(255, 87, 51, 0.5)', // Semi-transparent for overlay
          barThickness: 'flex',
          maxBarThickness: 20,
        },
        {
          type: 'bar',
          label: "Compounded wstETH Value",
          data: compoundingData.map(item => ({
            x: formatDate(item.date.value),
            y: item.wsteth_usd_value || 0, // Adjust based on frequency
          })),
          backgroundColor: 'rgba(255, 87, 51, 0.3)', // Semi-transparent for overlay
          barThickness: 'flex',
          maxBarThickness: 20,
        },
      ] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
          text: 'Value (USD)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: (context) => {
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(context[0].raw.x).toLocaleDateString(undefined, dateOptions);
          },
          label: (context) => {
            const dataPoint = context.raw;
            const tooltipItems = [
              `Value: $${dataPoint.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            ];
  
            if (showBreakdown && context.dataset.label !== "LP User Total Value" && context.dataset.label !== "Non-LP User Total Value") {
              const leverageRatio = (dataPoint.lp_user_aave_token_balance / dataPoint.non_lp_user_aave_token_balance).toFixed(2);
              tooltipItems.push(
                `AAVE Token Price: $${(dataPoint.aave_usd_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `wstETH Token Price: $${(dataPoint.wsteth_usd_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `LP User Total Value: $${(dataPoint.lp_user_total_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `LP User AAVE Tokens: ${(dataPoint.lp_user_aave_token_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `LP User wstETH Tokens: ${(dataPoint.lp_user_wsteth_token_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Non-LP User Total Value: $${(dataPoint.non_lp_user_total_value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Non-LP User AAVE Tokens: ${(dataPoint.non_lp_user_aave_token_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Non-LP User wstETH Tokens: ${(dataPoint.non_lp_user_wsteth_token_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Impermanent Loss: ${(dataPoint.manual_il || 0).toFixed(2)}%`,
                `Leverage Ratio: ${leverageRatio}`
              );
            }
  
            return tooltipItems;
          },
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="mx-2 mb-2 px-4 py-2 rounded transition duration-300 button-outline"
        style={{
          position: 'absolute',
          top: '13px',
          left: '81px',
          backgroundColor: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: '2px solid var(--button-outline)',
          fontSize: '13px',
          padding: '4px 8px',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--button-hover-bg)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--button-bg)';
        }}
      >
        {showBreakdown ? 'Hide AAVE/wstETH Breakdown' : 'Show AAVE/wstETH Breakdown'}
      </button>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AaveInvestmentAnalysisChart;