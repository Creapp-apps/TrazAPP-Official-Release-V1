const { createClient } = require('@supabase/supabase-js');

const url = 'https://fnzxjpynuijjxxpcpqtd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuenhqcHludWlqanh4cGNwcXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDc3MzYsImV4cCI6MjA4NzAyMzczNn0.1qgAvml5ATk6Hk_CfHTG7w97fIYgL_SXwxxrffM-tf4';

const supabase = createClient(url, key);

async function run() {
  const { data: rooms } = await supabase.from('rooms').select('id, name, type, medium, batches(id, name, tracking_code, grid_position, stage, genetic:genetics(name))');
  console.log("=== ROOMS SUMMARY ===");
  rooms.forEach(r => {
    console.log(`ROOM: [${r.id}] "${r.name}" (Type: ${r.type}) - Batches Count: ${r.batches?.length || 0}`);
    if (r.batches && r.batches.length > 0) {
      r.batches.slice(0, 5).forEach(b => console.log(`   -> Batch: ${b.name} (${b.tracking_code}) Genetic: ${b.genetic?.name} Pos: ${b.grid_position} Stage: ${b.stage}`));
    }
  });

  const { data: devices } = await supabase.from('trazapp_devices').select('id, device_id, bunker_name, room_id, alias, is_active, last_reading');
  console.log("\n=== TRAZAPP DEVICES SUMMARY ===");
  devices.forEach(d => {
    console.log(`DEVICE: ${d.device_id} | Alias: ${d.alias} | Bunker: ${d.bunker_name} | RoomID: ${d.room_id} | Active: ${d.is_active}`);
  });
}

run();
