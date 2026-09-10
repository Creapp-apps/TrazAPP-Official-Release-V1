const supabaseUrl = 'https://fnzxjpynuijjxxpcpqtd.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuenhqcHludWlqanh4cGNwcXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDc3MzYsImV4cCI6MjA4NzAyMzczNn0.1qgAvml5ATk6Hk_CfHTG7w97fIYgL_SXwxxrffM-tf4';

async function testAllTablesAnon() {
  console.log("=== Testing Tables for ANON Access ===");

  const headers = { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` };

  // 1. Rooms
  const rRes = await fetch(`${supabaseUrl}/rest/v1/rooms?select=id,name,type`, { headers });
  const rData = await rRes.json();
  console.log("1. Rooms (anon):", rRes.status, Array.isArray(rData) ? `Found ${rData.length} rooms` : rData);

  // 2. Batches
  const bRes = await fetch(`${supabaseUrl}/rest/v1/batches?discarded_at=is.null&select=id,quantity,stage,current_room_id`, { headers });
  const bData = await bRes.json();
  console.log("2. Batches (anon):", bRes.status, Array.isArray(bData) ? `Found ${bData.length} active batches` : bData);

  // 3. Devices
  const dRes = await fetch(`${supabaseUrl}/rest/v1/trazapp_devices?select=id,device_id,bunker_name,room_id`, { headers });
  const dData = await dRes.json();
  console.log("3. TrazApp Devices (anon):", dRes.status, Array.isArray(dData) ? `Found ${dData.length} devices` : dData);
}

testAllTablesAnon();
