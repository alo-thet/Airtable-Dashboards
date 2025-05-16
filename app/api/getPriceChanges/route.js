//connect to airtable
import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

const base = airtable.base(process.env.BASE_ID);

const table = base(process.env.PRODUCTS_PRICE_CHANGES_LAST_30_DAYS);

export async function GET() {
  try {
    const records = await table.select().all();

    // Map and extract the data
    let data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    // Sort alphabetically by Product Name to keep the order consistent
    data = data.sort((a, b) => {
      if ("Product Name" in a && "Product Name" in b) {
        return a["Product Name"].localeCompare(b["Product Name"]);
      }
      return 0;
    });

    // Limit to top 20 items
    data = data.slice(0, 20);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching price changes data from Airtable:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
