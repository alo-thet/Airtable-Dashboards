"use client";

import { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import ChartComponent from "./components/ChartComponent";
import PieChartComponent from "./components/PieChartComponent";

export default function Home() {
  // State for discount data
  const [discountData, setDiscountData] = useState([]);
  const [discountXAxis, setDiscountXAxis] = useState("Product Name");
  const [discountYAxis, setDiscountYAxis] = useState("Units Sold");

  // State for best sellers data
  const [bestSellersData, setBestSellersData] = useState([]);
  const [bestSellersXAxis, setBestSellersXAxis] = useState("Product Name");
  const [bestSellersYAxis, setBestSellersYAxis] = useState("Total Price");

  // State for voided/cancelled data
  const [voidedData, setVoidedData] = useState([]);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch discount data
        const discountResponse = await fetch("/api/getData");
        if (!discountResponse.ok) {
          throw new Error(`HTTP error! Status: ${discountResponse.status}`);
        }
        const discountResult = await discountResponse.json();
        if (!discountResult.success) {
          throw new Error(
            discountResult.error || "Failed to fetch discount data"
          );
        }
        setDiscountData(discountResult.data);

        // Set default axes for discount data if fields exist
        if (discountResult.data.length > 0) {
          if ("Product Name" in discountResult.data[0]) {
            setDiscountXAxis("Product Name");
          }
          if ("Units Sold" in discountResult.data[0]) {
            setDiscountYAxis("Units Sold");
          } else {
            // Find first numeric field for y-axis
            const firstNumericField = Object.keys(discountResult.data[0]).find(
              (key) =>
                typeof discountResult.data[0][key] === "number" && key !== "id"
            );
            if (firstNumericField) {
              setDiscountYAxis(firstNumericField);
            }
          }
        }

        // Fetch best sellers data
        const bestSellersResponse = await fetch("/api/getBestSellers");
        if (!bestSellersResponse.ok) {
          throw new Error(`HTTP error! Status: ${bestSellersResponse.status}`);
        }
        const bestSellersResult = await bestSellersResponse.json();
        if (!bestSellersResult.success) {
          throw new Error(
            bestSellersResult.error || "Failed to fetch best sellers data"
          );
        }
        setBestSellersData(bestSellersResult.data);

        // Set default axes for best sellers data if fields exist
        if (bestSellersResult.data.length > 0) {
          if ("Product Name" in bestSellersResult.data[0]) {
            setBestSellersXAxis("Product Name");
          }
          if ("Total Price" in bestSellersResult.data[0]) {
            setBestSellersYAxis("Total Price");
          } else {
            // Find first numeric field for y-axis
            const firstNumericField = Object.keys(
              bestSellersResult.data[0]
            ).find(
              (key) =>
                typeof bestSellersResult.data[0][key] === "number" &&
                key !== "id"
            );
            if (firstNumericField) {
              setBestSellersYAxis(firstNumericField);
            }
          }
        }

        // Fetch voided/cancelled data
        const voidedResponse = await fetch("/api/getVoidedCancelled");
        if (!voidedResponse.ok) {
          throw new Error(`HTTP error! Status: ${voidedResponse.status}`);
        }
        const voidedResult = await voidedResponse.json();
        if (!voidedResult.success) {
          throw new Error(
            voidedResult.error || "Failed to fetch voided/cancelled data"
          );
        }
        setVoidedData(voidedResult.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get available fields for axis selection
  const getDiscountFields = () => {
    if (!discountData.length) return [];
    return Object.keys(discountData[0]);
  };

  const getBestSellerFields = () => {
    if (!bestSellersData.length) return [];
    return Object.keys(bestSellersData[0]);
  };

  return (
    <main className="w-full min-h-screen bg-white text-black p-0">
      <div className="w-full px-2 py-4">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Product Sales Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-black px-4 py-3 rounded font-semibold">
            Error: {error}
          </div>
        ) : (
          <>
            {/* Bento Box Grid Layout with minimal gaps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              {/* First Box - Discount Chart spanning two grid spaces (1-2) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-black text-lg">
                    Product Discount
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      value={discountXAxis}
                      onChange={(e) => setDiscountXAxis(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-black"
                    >
                      <option value="" disabled>
                        X-Axis
                      </option>
                      {getDiscountFields().map((field) => (
                        <option key={field} value={field}>
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")}
                        </option>
                      ))}
                    </select>

                    <select
                      value={discountYAxis}
                      onChange={(e) => setDiscountYAxis(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-black"
                    >
                      <option value="" disabled>
                        Y-Axis
                      </option>
                      {getDiscountFields().map((field) => (
                        <option key={field} value={field}>
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="h-96">
                  <ChartComponent
                    data={discountData}
                    xAxis={discountXAxis}
                    yAxis={discountYAxis}
                    title={`${discountYAxis} by ${discountXAxis}`}
                    height={400}
                  />
                </div>
              </div>

              {/* Box 3 - Voided Items Pie Chart */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-bold text-black">
                    Voided Items by Operator
                  </h3>
                </div>
                <div className="h-80">
                  <PieChartComponent
                    data={voidedData}
                    labelField="Operator Name"
                    valueField="Voided Items"
                    title="Voided Items Distribution"
                    height={300}
                  />
                </div>
              </div>

              {/* Box 4 - Placeholder */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-bold text-black">Weekly Sales Trend</h3>
                </div>
                <div className="h-80 flex items-center justify-center bg-gray-50">
                  <p className="text-black font-semibold">
                    Future visualization
                  </p>
                </div>
              </div>

              {/* Second Chart - Best Sellers spanning boxes 5-6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-black text-lg">
                    Revenue by Product
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      value={bestSellersXAxis}
                      onChange={(e) => setBestSellersXAxis(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-black"
                    >
                      <option value="" disabled>
                        X-Axis
                      </option>
                      {getBestSellerFields().map((field) => (
                        <option key={field} value={field}>
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")}
                        </option>
                      ))}
                    </select>

                    <select
                      value={bestSellersYAxis}
                      onChange={(e) => setBestSellersYAxis(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-black"
                    >
                      <option value="" disabled>
                        Y-Axis
                      </option>
                      {getBestSellerFields().map((field) => (
                        <option key={field} value={field}>
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="h-96">
                  <ChartComponent
                    data={bestSellersData}
                    xAxis={bestSellersXAxis}
                    yAxis={bestSellersYAxis}
                    title={`${bestSellersYAxis} by ${bestSellersXAxis}`}
                    height={400}
                  />
                </div>
              </div>

              {/* Remaining placeholder boxes */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-2 border-b border-gray-200">
                    <h3 className="font-bold text-black">
                      Visualization {index + 7}
                    </h3>
                  </div>
                  <div className="h-80 flex items-center justify-center bg-gray-50">
                    <p className="text-black font-semibold">
                      Future visualization
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Tables Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Discount Data Table */}
              <div>
                <h2 className="text-xl font-bold mb-2 text-black">
                  Product Sales Data
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <DataTable data={discountData} />
                </div>
              </div>

              {/* Best Sellers Data Table */}
              <div>
                <h2 className="text-xl font-bold mb-2 text-black">
                  Best Sellers Data
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <DataTable data={bestSellersData} />
                </div>
              </div>

              {/* Voided/Cancelled Data Table */}
              <div>
                <h2 className="text-xl font-bold mb-2 text-black">
                  Voided Items Data
                </h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <DataTable data={voidedData} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
