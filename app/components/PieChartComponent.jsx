"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

// Colorful palette for the pie segments
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

export default function PieChartComponent({
  data,
  labelField = "Operator Name",
  valueField = "Voided Items",
  title = "Pie Chart",
  height = 400,
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare data for the chart
    const labels = data.map((item) => String(item[labelField] || ""));
    const values = data.map((item) => Number(item[valueField] || 0));

    // Generate colors for each segment
    const backgroundColors = values.map(
      (_, index) => colorPalette[index % colorPalette.length]
    );

    const borderColors = backgroundColors.map((color) =>
      color.replace("0.7", "1")
    );

    // Create chart
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
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
            position: "right",
            labels: {
              color: "#000000",
              font: {
                size: 13,
                weight: "bold",
              },
              padding: 15,
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
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
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
  }, [data, labelField, valueField, title]);

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center font-bold text-black">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow h-full flex items-center justify-center">
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
}
