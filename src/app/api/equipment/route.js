import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'equipmentRecordData.json');

export async function GET() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read data' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Read the existing data
    const objectData = fs.readFileSync(dataPath, 'utf8');
    // Get the data from the request body
    const newData = await req.json();
    let arrayData = JSON.parse(objectData);
    arrayData.push(newData);
    // Convert the updated data to a JSON string
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
export async function PUT(req) {
  try {
    // Read the existing data
    const objectData = fs.readFileSync(dataPath, 'utf8');
    const arrayData = JSON.parse(objectData);

    // Get the updated record from the request body
    const updatedRecord = await req.json();

    // Find the index of the record to update
    const recordIndex = arrayData.findIndex((item) => item.id === updatedRecord.id);

    if (recordIndex === -1) {
      return new Response(JSON.stringify({ message: 'Record not found' }), { status: 404 });
    }

    // Update the record
    arrayData[recordIndex] = { ...arrayData[recordIndex], ...updatedRecord };

    // Save the updated data back to the file
    const updatedData = JSON.stringify(arrayData, null, 2);
    fs.writeFileSync(dataPath, updatedData, 'utf8');

    return new Response(JSON.stringify({ message: 'Record updated successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error updating data' }), { status: 500 });
  }
}

