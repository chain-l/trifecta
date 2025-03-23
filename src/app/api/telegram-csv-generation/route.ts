import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get csvContent
    const { csvContent } = await req.json();

    // Validate the input
    if (!csvContent) {
      return NextResponse.json({ error: 'CSV content is required' }, { status: 400 });
    }

    // Define the file path (e.g., in a 'downloads' directory)
    const downloadsPath = path.join(process.cwd(), 'downloads');
    await fs.mkdir(downloadsPath, { recursive: true });
    const filePath = path.join(downloadsPath, 'trading_signal.csv');

    // Write the CSV content to the file
    await fs.writeFile(filePath, csvContent, 'utf8');

    // Return a success response
    return NextResponse.json({ message: 'CSV file stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error storing CSV:', error);
    return NextResponse.json({ error: 'Failed to store CSV file' }, { status: 500 });
  }
}

// Optional: Handle preflight requests (e.g., for CORS)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}