//connect to airtable
import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

const base = airtable.base(process.env.BASE_ID);

const table = base(process.env.BEST_SELLER_TABLE);

export async function GET() {
  try {
    const records = await table.select().all();
    const data = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching best seller data from Airtable:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
