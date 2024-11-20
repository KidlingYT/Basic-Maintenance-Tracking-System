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
    const newData = await req.json();
    fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2), 'utf8');
    return new Response(JSON.stringify({ message: 'Data saved!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to write data' }), { status: 500 });
  }
}
