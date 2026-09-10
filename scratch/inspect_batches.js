const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function inspect() {
  const { data: devices, error: devErr } = await supabase
    .from('trazapp_devices')
    .select('*');
  console.log("Devices:", devices, devErr);

  if (devices && devices.length > 0) {
    const roomId = devices[0].room_id;
    console.log("Room ID of device:", roomId);

    const { data: room, error: rErr } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId);
    console.log("Room:", room, rErr);

    const { data: batches, error: bErr } = await supabase
      .from('batches')
      .select('id, name, tracking_code, stage, grid_position, room_id, current_room_id, quantity, genetic_id, genetics(name)')
      .or(`room_id.eq.${roomId},current_room_id.eq.${roomId}`)
      .is('discarded_at', null);
    console.log("Batches in room:", batches, bErr);
  }
}

inspect();
