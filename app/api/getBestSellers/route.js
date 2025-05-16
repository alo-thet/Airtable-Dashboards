//connect to airtable
import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

const base = airtable.base(process.env.BASE_ID);

const table = base(process.env.BEST_SELLER_TABLE);

export async function GET() {
  try {
    const records = await table.select().all();

    // Map and extract the data
    let data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    // Sort by Total Price in descending order (if it exists)
    data = data.sort((a, b) => {
      // Try to sort by Total Price first
      if ("Total Price" in a && "Total Price" in b) {
        return b["Total Price"] - a["Total Price"];
      }
      // If Total Price doesn't exist, try Units Sold
      else if ("Units Sold" in a && "Units Sold" in b) {
        return b["Units Sold"] - a["Units Sold"];
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
    console.error("Error fetching best seller data from Airtable:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
