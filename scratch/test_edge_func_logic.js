const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function simulateEdgeFunction(deviceId, token) {
  console.log(`=== Simulating Fixed Edge Function for device: ${deviceId} ===`);

  // 1. Auth device as admin/service (or query trazapp_devices)
  const email = 'trazappadmin@admin.com';
  const password = 'Seba4794!';
  await supabase.auth.signInWithPassword({ email, password });

  const { data: device, error: devErr } = await supabase
    .from('trazapp_devices')
    .select('id, device_id, device_token, organization_id, is_active, room_id, bunker_name, device_type')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (devErr || !device) {
    console.error("Device lookup failed:", devErr);
    return;
  }

  console.log("Found device in DB:", device);

  let enrichedMeta = {
    bunker_name: device.bunker_name || null,
    room_name: null,
    room_type: null,
    plant_count: 0,
    genetics: [],
    plant_stage: null,
    tasks: [],
    plant_tags: [],
  };

  if (device.room_id) {
    // Room info
    const { data: room } = await supabase
      .from('rooms')
      .select('id, name, type')
      .eq('id', device.room_id)
      .maybeSingle();

    if (room) {
      enrichedMeta.room_name = room.name;
      enrichedMeta.room_type = room.type;
    }

    // Active batches in this room
    const { data: batches } = await supabase
      .from('batches')
      .select('id, name, quantity, stage, genetic:genetics(name)')
      .eq('current_room_id', device.room_id)
      .is('discarded_at', null);

    if (batches && batches.length > 0) {
      let totalPlants = 0;
      const geneticNames = [];

      for (const batch of batches) {
        totalPlants += batch.quantity || 0;
        const gName = batch.genetic?.name;
        if (gName && !geneticNames.includes(gName)) {
          geneticNames.push(gName);
        }
        if (batch.stage) {
          enrichedMeta.plant_stage = batch.stage;
        }
      }

      enrichedMeta.plant_count = totalPlants;
      enrichedMeta.genetics = geneticNames;
    }

    // Tasks for room
    const { data: tasks } = await supabase
      .from('chakra_tasks')
      .select('id, title, due_date, status')
      .eq('room_id', device.room_id)
      .in('status', ['pending', 'in_progress'])
      .order('due_date', { ascending: true })
      .limit(5);

    if (tasks) {
      enrichedMeta.tasks = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        priority: 'normal',
        due_date: t.due_date,
        status: t.status,
      }));
    }
  }

  const responsePayload = {
    success: true,
    message: 'Telemetry received',
    device: {
      bunker_name: enrichedMeta.bunker_name,
      room_name: enrichedMeta.room_name,
      room_type: enrichedMeta.room_type,
      plant_count: enrichedMeta.plant_count,
      plant_stage: enrichedMeta.plant_stage,
      genetics: enrichedMeta.genetics,
      tasks: enrichedMeta.tasks,
      plant_tags: enrichedMeta.plant_tags,
    },
  };

  console.log("\nSimulated Edge Function Response Payload:");
  console.log(JSON.stringify(responsePayload, null, 2));
}

simulateEdgeFunction('TrazApp_A3F2', '8f3a1b2c4d5e6f7091a2b3c4d5e6f708');
