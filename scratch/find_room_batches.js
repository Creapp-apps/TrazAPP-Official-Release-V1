const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function findRooms() {
  const { data: rooms, error: rErr } = await supabase
    .from('rooms')
    .select('id, name, type, grid_rows, grid_columns');
  console.log("Rooms:", rooms, rErr);

  const { data: batches, error: bErr } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, current_room_id, quantity, genetics(name)')
    .not('grid_position', 'is', null)
    .is('discarded_at', null);

  console.log(`Batches with grid_position: ${batches?.length || 0}`);
  if (batches) {
    const byRoom = {};
    batches.forEach(b => {
      byRoom[b.current_room_id] = (byRoom[b.current_room_id] || 0) + 1;
    });
    console.log("Batches by room:", byRoom);
    console.log("Sample batches with grid_position:", batches.slice(0, 20));
  }
}

findRooms();
