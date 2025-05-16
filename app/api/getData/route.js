//connect to airtable
import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

const base = airtable.base(process.env.BASE_ID);

const table = base(process.env.PRODUCT_WITH_HIGHEST_DISCOUNT_USAGE);

export async function GET() {
  try {
    const records = await table.select().all();

    // Map and extract the data
    let data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    // Sort by Units Sold in descending order (if it exists)
    data = data.sort((a, b) => {
      // Try to sort by Units Sold first
      if ("Units Sold" in a && "Units Sold" in b) {
        return b["Units Sold"] - a["Units Sold"];
      }
      // If Units Sold doesn't exist, try Total Price
      else if ("Total Price" in a && "Total Price" in b) {
        return b["Total Price"] - a["Total Price"];
      }
      // Fallback to any numeric field
      else {
        const numericKeys = Object.keys(a).filter(
          (key) => typeof a[key] === "number" && key !== "id"
        );

        if (numericKeys.length > 0) {
          const firstNumericKey = numericKeys[0];
          return b[firstNumericKey] - a[firstNumericKey];
        }

        return 0;
      }
    });

    // Limit to top 10
    data = data.slice(0, 10);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data from Airtable:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
