import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'maintenanceRecordData.json');

export function GET() {
  const data = fs.readFileSync(dataPath, 'utf8');
  return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  try {
    // Read the existing data
    const objectData = fs.readFileSync(dataPath, 'utf8');
    // Get the data from the request
    const newData = await req.json();
    let arrayData = JSON.parse(objectData);
    arrayData.push(newData);
    const updatedData = JSON.stringify(arrayData, null, 2);
    fs.writeFileSync(dataPath, updatedData, 'utf8');
    // Return a success response
    return new Response(JSON.stringify({ message: 'Data stored successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    // Return an error response
    return new Response(JSON.stringify({ message: 'Error storing data' }), { status: 500 });
  }
}