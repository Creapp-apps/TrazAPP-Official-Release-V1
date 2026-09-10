const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

async function testRESTFallback() {
  console.log("=== Testing REST Fallback queries as performed by ESP32 ===");

  // 1. Fetch device row
  const devUrl = `${supabaseUrl}/rest/v1/trazapp_devices?device_id=eq.TrazApp_A3F2&select=bunker_name,room_id`;
  const devRes = await fetch(devUrl, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const devData = await devRes.json();
  console.log("1. Device query result:", devData);

  if (!devData || devData.length === 0 || !devData[0].room_id) {
    console.error("Device row not found or missing room_id!");
    return;
  }

  const bunkerName = devData[0].bunker_name;
  const roomId = devData[0].room_id;
  console.log(`Bunker: "${bunkerName}", Room ID: "${roomId}"`);

  // 2. Fetch batches info for room
  const batchUrl = `${supabaseUrl}/rest/v1/batches?current_room_id=eq.${roomId}&discarded_at=is.null&select=quantity,current_stage`;
  const batchRes = await fetch(batchUrl, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const batchData = await batchRes.json();
  console.log("2. Batches query result:", batchData);

  let totalPlants = 0;
  let plantStage = 'Vegetativo';
  if (Array.isArray(batchData)) {
    batchData.forEach(b => {
      totalPlants += (b.quantity || 0);
      if (b.current_stage) plantStage = b.current_stage;
    });
  }
  console.log(`Total Plants: ${totalPlants}, Stage: ${plantStage}`);

  // 3. Fetch tasks for room
  const taskUrl = `${supabaseUrl}/rest/v1/chakra_tasks?room_id=eq.${roomId}&status=in.(pending,in_progress)&select=title,priority&limit=5`;
  const taskRes = await fetch(taskUrl, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const taskData = await taskRes.json();
  console.log("3. Tasks query result:", taskData);

  console.log("\n========================================================");
  console.log(`SUMMARY FOR ESP32 DISPLAY:`);
  console.log(` - Bunker/Mesa: ${bunkerName}`);
  console.log(` - Plantas: ${totalPlants}`);
  console.log(` - Fase: ${plantStage}`);
  console.log(` - Tareas Pendientes: ${taskData.length}`);
  taskData.forEach((t, i) => console.log(`    ${i + 1}. [${t.priority || 'normal'}] ${t.title}`));
  console.log("========================================================");
}

testRESTFallback();
