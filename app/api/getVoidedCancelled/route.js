//connect to airtable
import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

const base = airtable.base(process.env.BASE_ID);

const table = base(process.env.VOIDED_CANCELLED_COUNT_TABLE);

export async function GET() {
  try {
    const records = await table.select().all();

    // Map and extract the data
    let data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    // Sort by Voided Items in descending order
    data = data.sort((a, b) => {
      // Try to sort by Voided Items first
      if ("Voided Items" in a && "Voided Items" in b) {
        return b["Voided Items"] - a["Voided Items"];
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

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching voided/cancelled data from Airtable:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
