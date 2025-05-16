"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js components
Chart.register(...registerables);

// Modern color palette with better contrast
const colorPalette = [
  "rgba(53, 162, 235, 0.8)", // Blue
  "rgba(255, 99, 132, 0.8)", // Red
  "rgba(75, 192, 192, 0.8)", // Teal
  "rgba(255, 159, 64, 0.8)", // Orange
  "rgba(153, 102, 255, 0.8)", // Purple
  "rgba(255, 205, 86, 0.8)", // Yellow
  "rgba(201, 203, 207, 0.8)", // Gray
  "rgba(94, 232, 129, 0.8)", // Green
  "rgba(239, 83, 80, 0.8)", // Bright Red
  "rgba(66, 133, 244, 0.8)", // Google Blue
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

    const borderColors = backgroundColors.map(
      (color) => color.replace(/[^,]+(?=\))/, "1") // Set opacity to 1 for borders
    );

    // Calculate total for percentages
    const total = values.reduce((sum, value) => sum + value, 0);

    // Create chart
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "doughnut", // Changed to doughnut for a more modern look
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            hoverOffset: 15, // Slightly pull out the segment on hover
          },
        ],
      },
      options: {
        cutout: "50%", // Doughnut hole size
        radius: "90%", // Make the chart a bit larger
        layout: {
          padding: 20, // Add some padding around the chart
        },
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
              bottom: 20,
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
              usePointStyle: true, // Use circles instead of rectangles in legend
              pointStyle: "circle",
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
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
      plugins: [
        {
          id: "centerText",
          afterDraw: function (chart) {
            const ctx = chart.ctx;

            // Add a center text with the total
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000000";
            ctx.font = "bold 24px Arial";
            ctx.fillText(
              total,
              chart.chartArea.left +
                (chart.chartArea.right - chart.chartArea.left) / 2,
              chart.chartArea.top +
                (chart.chartArea.bottom - chart.chartArea.top) / 2
            );
            ctx.font = "bold 14px Arial";
            ctx.fillText(
              "Total",
              chart.chartArea.left +
                (chart.chartArea.right - chart.chartArea.left) / 2,
              chart.chartArea.top +
                (chart.chartArea.bottom - chart.chartArea.top) / 2 +
                25
            );
            ctx.restore();
          },
        },
      ],
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
    <div className="bg-white rounded shadow h-full w-full flex items-center justify-center p-2">
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
}
