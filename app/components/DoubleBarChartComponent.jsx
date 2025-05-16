"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DoubleBarChartComponent({
  data,
  labelField = "Product Name",
  previousValueField = "Min Price (£)",
  currentValueField = "Max Price (£)",
  title = "Price Comparison",
  height = 400,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clean up previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Extract labels and data
    const labels = data.map((item) => item[labelField] || "Unknown");
    const previousValues = data.map((item) => item[previousValueField] || 0);
    const currentValues = data.map((item) => item[currentValueField] || 0);

    // Create vibrant but professional color arrays
    const previousColor = "rgba(54, 162, 235, 0.7)"; // Blue
    const currentColor = "rgba(255, 99, 132, 0.7)"; // Red

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Previous Price",
            data: previousValues,
            backgroundColor: previousColor,
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Current Price",
            data: currentValues,
            backgroundColor: currentColor,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#000000",
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                weight: "bold",
              },
              color: "#000000",
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.parsed.x;
                return `${label}: £${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: "#000000",
              font: {
                weight: "bold",
              },
              callback: function (value) {
                return "£" + value.toFixed(2);
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#000000",
              font: {
                weight: "bold",
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labelField, previousValueField, currentValueField, title]);

  return (
    <div style={{ height: height, width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
