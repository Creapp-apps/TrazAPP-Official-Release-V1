const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function run() {
  console.log("=== Checking Supabase for Bunker & Device Linking ===");

  // 1. Login as Admin
  const email = 'trazappadmin@admin.com';
  const password = 'Seba4794!';
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

  if (authErr) {
    console.error("Auth error:", authErr.message);
    return;
  }
  console.log("Logged in user:", authData.user.email, "| ID:", authData.user.id);

  // 2. Fetch Organizations / Profiles / Rooms
  const { data: rooms, error: roomsErr } = await supabase
    .from('rooms')
    .select('*');

  if (roomsErr) {
    console.error("Error fetching rooms:", roomsErr);
    return;
  }

  console.log(`Found ${rooms?.length || 0} rooms:`);
  rooms?.forEach(r => console.log(` - Room: "${r.name}" (ID: ${r.id}, Org: ${r.organization_id}, Type: ${r.type})`));

  const bunkerRoom = rooms?.find(r => r.name.toLowerCase().includes('bunker'));
  if (!bunkerRoom) {
    console.error("No room matching 'Bunker' found!");
    return;
  }

  console.log(`\nTarget Room selected: "${bunkerRoom.name}" (ID: ${bunkerRoom.id})`);

  // 3. Fetch Batches for this room
  const { data: batches, error: batchErr } = await supabase
    .from('batches')
    .select('*')
    .eq('current_room_id', bunkerRoom.id)
    .is('discarded_at', null);

  if (batchErr) {
    console.error("Error fetching batches:", batchErr);
  } else {
    console.log(`Found ${batches?.length || 0} batches in "${bunkerRoom.name}":`);
    let totalPlants = 0;
    batches?.forEach(b => {
      totalPlants += (b.quantity || 0);
      console.log(` - Batch ID: ${b.id}, Name/Tag: "${b.batch_code || b.name || 'N/A'}", Quantity: ${b.quantity}, Stage: ${b.current_stage}, Table/Bunker: ${b.bunker_name || b.table_name || 'N/A'}`);
    });
    console.log(`Total Plants: ${totalPlants}`);
  }

  // 4. Fetch Tasks for this room
  const { data: tasks, error: taskErr } = await supabase
    .from('chakra_tasks')
    .select('*')
    .eq('room_id', bunkerRoom.id);

  if (taskErr) {
    console.error("Error fetching tasks:", taskErr);
  } else {
    console.log(`Found ${tasks?.length || 0} tasks for room "${bunkerRoom.name}":`);
    tasks?.forEach(t => console.log(` - Task ID: ${t.id}, Title: "${t.title}", Status: ${t.status}, Priority: ${t.priority}`));
  }

  // 5. Fetch or Upsert Device TrazApp_A3F2
  const deviceId = 'TrazApp_A3F2';
  const { data: existingDevice, error: devFetchErr } = await supabase
    .from('trazapp_devices')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (devFetchErr) {
    console.error("Error checking device:", devFetchErr);
    return;
  }

  console.log("\nExisting Device row:", existingDevice);

  const deviceData = {
    device_id: deviceId,
    alias: 'Bunker - Mesa Fancy',
    room_id: bunkerRoom.id,
    bunker_name: 'Fancy',
    device_type: 'sensor',
    organization_id: bunkerRoom.organization_id,
    is_active: true,
    is_provisioned: true,
  };

  if (existingDevice) {
    console.log("Updating existing device row...");
    const { data: updated, error: updateErr } = await supabase
      .from('trazapp_devices')
      .update(deviceData)
      .eq('device_id', deviceId)
      .select();

    if (updateErr) {
      console.error("Update failed:", updateErr);
    } else {
      console.log("SUCCESS! Device updated:", updated);
    }
  } else {
    console.log("Inserting new device row...");
    const { data: inserted, error: insertErr } = await supabase
      .from('trazapp_devices')
      .insert([deviceData])
      .select();

    if (insertErr) {
      console.error("Insert failed:", insertErr);
    } else {
      console.log("SUCCESS! Device inserted:", inserted);
    }
  }

  // 6. Test Edge Function / Telemetry Webhook response simulation
  console.log("\nSimulating telemetry payload from ESP32 to webhook...");
  const webhookUrl = process.env.REACT_APP_SUPABASE_URL + '/functions/v1/trazapp-telemetry';
  const testPayload = {
    device: 'TrazApp_35',
    device_id: deviceId,
    token: '8f3a1b2c4d5e6f7091a2b3c4d5e6f708',
    firmware: 'v6.0-PRO-3.5',
    uptime_s: 100,
    sensors: { temp_c: 24.5, hum_pct: 60.0, soil_pct: 45.0, vpd_kpa: 1.15 },
    vpd: { stage: 3, stage_name: 'Floracion', in_range: true, vpd_low: false, vpd_min: 1.0, vpd_max: 1.5 },
    meta: { temp_real: true, hum_real: true, soil_real: true, rssi_dbm: -55, ip: '192.168.1.50' }
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
        'X-Device-ID': deviceId,
        'X-Device-Secret': '8f3a1b2c4d5e6f7091a2b3c4d5e6f708',
      },
      body: JSON.stringify(testPayload)
    });

    const resText = await res.text();
    console.log(`Webhook status: ${res.status}`);
    console.log(`Webhook response: ${resText}`);
  } catch (e) {
    console.error("Webhook fetch error:", e);
  }
}

run();
