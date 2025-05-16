"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

// Colorful palette for the bars
const colorPalette = [
  "rgba(75, 192, 192, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 99, 132, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(255, 205, 86, 0.7)",
  "rgba(201, 203, 207, 0.7)",
  "rgba(94, 232, 129, 0.7)",
  "rgba(162, 94, 232, 0.7)",
  "rgba(232, 94, 162, 0.7)",
];

export default function ChartComponent({
  data,
  xAxis = "id",
  yAxis,
  title = "Bar Chart",
  height = 400,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Create or update chart when data or axes change
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Find a numeric field for y-axis if not specified
    const effectiveYAxis =
      yAxis ||
      Object.keys(data[0]).find(
        (key) => typeof data[0][key] === "number" && key !== xAxis
      ) ||
      Object.keys(data[0])[0];

    // Prepare data for the chart - for horizontal bar chart, we swap x and y
    const labels = data.map((item) => String(item[xAxis] || ""));
    const values = data.map((item) => Number(item[effectiveYAxis] || 0));

    // Generate colors for each bar
    const backgroundColors = values.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );

    const borderColors = backgroundColors.map((color) =>
      color.replace("0.7", "1")
    );

    // Create chart - using horizontal bar chart
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label:
              effectiveYAxis.charAt(0).toUpperCase() +
              effectiveYAxis.slice(1).replace(/([A-Z])/g, " $1"),
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        indexAxis: "y", // This makes the chart horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            color: "#000000",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              top: 10,
              bottom: 10,
            },
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#000000",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#000000",
            bodyColor: "#000000",
            borderColor: "#000000",
            borderWidth: 1,
            titleFont: {
              size: 16,
              weight: "bold",
            },
            bodyFont: {
              size: 14,
              weight: "bold",
            },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: function (tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function (context) {
                return `${effectiveYAxis}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            // This is now the value axis (horizontal)
            beginAtZero: true,
            grid: {
              color: "rgba(200, 200, 200, 0.2)",
            },
            ticks: {
              color: "#000000",
              font: {
                size: 13,
                weight: "bold",
              },
            },
          },
          y: {
            // This is now the category axis (vertical)
            grid: {
              display: false,
            },
            ticks: {
              color: "#000000",
              font: {
                size: 13,
                weight: "bold",
              },
            },
          },
        },
        layout: {
          padding: 0, // Minimize padding
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, xAxis, yAxis, title]);

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center font-bold text-black">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow h-full">
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
}
