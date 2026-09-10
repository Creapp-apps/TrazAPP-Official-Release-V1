const supabaseUrl = 'https://fnzxjpynuijjxxpcpqtd.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuenhqcHludWlqanh4cGNwcXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDc3MzYsImV4cCI6MjA4NzAyMzczNn0.1qgAvml5ATk6Hk_CfHTG7w97fIYgL_SXwxxrffM-tf4';
const roomId = 'dbf2bf0b-c2e8-48bc-a17c-d590b1512661'; // Bunker

async function testAnonQueriesFixed() {
  console.log("=== Testing Fixed Anon Queries ===");

  // 1. Device
  const devUrl = `${supabaseUrl}/rest/v1/trazapp_devices?device_id=eq.TrazApp_A3F2&select=bunker_name,room_id`;
  const devRes = await fetch(devUrl, { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } });
  console.log("Device (anon):", devRes.status, await devRes.json());

  // 2. Batches
  const batchUrl = `${supabaseUrl}/rest/v1/batches?current_room_id=eq.${roomId}&discarded_at=is.null&select=quantity,stage`;
  const bRes = await fetch(batchUrl, { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } });
  console.log("Batches (anon):", bRes.status, await bRes.json());

  // 3. Tasks
  const taskUrl = `${supabaseUrl}/rest/v1/chakra_tasks?room_id=eq.${roomId}&status=in.(pending,in_progress)&select=title,status&limit=5`;
  const tRes = await fetch(taskUrl, { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } });
  console.log("Tasks (anon):", tRes.status, await tRes.json());
}

testAnonQueriesFixed();
