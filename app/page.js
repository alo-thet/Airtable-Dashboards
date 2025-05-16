"use client";

import { useState, useEffect } from "react";
import DataTable from "./components/DataTable";
import ChartComponent from "./components/ChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import DoubleBarChartComponent from "./components/DoubleBarChartComponent";

export default function Home() {
  // State for discount data
  const [discountData, setDiscountData] = useState([]);
  const [discountXAxis, setDiscountXAxis] = useState("Product Name");
  const [discountYAxis, setDiscountYAxis] = useState("Units Sold");

  // State for best sellers data
  const [bestSellersData, setBestSellersData] = useState([]);
  const [bestSellersXAxis, setBestSellersXAxis] = useState("Product Name");
  const [bestSellersYAxis, setBestSellersYAxis] = useState("Units Sold");

  // State for voided/cancelled data
  const [voidedData, setVoidedData] = useState([]);

  // State for price changes data
  const [priceChangesData, setPriceChangesData] = useState([]);

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
          if ("Units Sold" in bestSellersResult.data[0]) {
            setBestSellersYAxis("Units Sold");
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

        // Fetch price changes data
        const priceChangesResponse = await fetch("/api/getPriceChanges");
        if (!priceChangesResponse.ok) {
          throw new Error(`HTTP error! Status: ${priceChangesResponse.status}`);
        }
        const priceChangesResult = await priceChangesResponse.json();
        if (!priceChangesResult.success) {
          throw new Error(
            priceChangesResult.error || "Failed to fetch price changes data"
          );
        }
        setPriceChangesData(priceChangesResult.data);
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
              {/* First Box - Best Sellers Chart spanning two grid spaces (1-2) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-black text-lg">
                    Best Selling Product
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

              {/* Box 4 - Price Changes Chart */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-3">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-bold text-black text-lg">
                    Product Price Changes (Last 30 Days)
                  </h3>
                </div>
                <div className="h-[500px]">
                  <DoubleBarChartComponent
                    data={priceChangesData}
                    labelField="Product Name"
                    previousValueField="Min Price (£)"
                    currentValueField="Max Price (£)"
                    title="Previous vs Current Prices"
                    height={480}
                  />
                </div>
              </div>

              {/* Second Chart - Discount Chart spanning boxes 5-6 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-black text-lg">
                    Units Sold by Product
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
            </div>

            {/* Data Tables Section - Removed as requested */}
          </>
        )}
      </div>
    </main>
  );
}
