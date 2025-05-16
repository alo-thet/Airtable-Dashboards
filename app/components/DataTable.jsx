"use client";

import { useState } from "react";

export default function DataTable({ data }) {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center font-bold text-black">
        No data available
      </div>
    );
  }

  // Extract column headers from the first data item
  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left font-bold text-black border-b"
              >
                {column.charAt(0).toUpperCase() +
                  column.slice(1).replace(/([A-Z])/g, " $1")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column}`}
                  className="px-4 py-3 border-b font-semibold text-black"
                >
                  {typeof row[column] === "object"
                    ? JSON.stringify(row[column])
                    : String(row[column] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
