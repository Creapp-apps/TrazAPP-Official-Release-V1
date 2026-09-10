const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function inspectRoom() {
  const roomId = 'dbf2bf0b-c2e8-48bc-a17c-d590b1512661';
  const { data: room, error: rErr } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId);
  console.log("Room details:", room, rErr);

  const { data: batches, error: bErr } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, quantity, genetics(name)')
    .eq('current_room_id', roomId)
    .is('discarded_at', null)
    .order('grid_position', { ascending: true });

  console.log(`Batches in this room: ${batches?.length || 0}`);
  console.log("All batches sorted by grid_position:");
  batches.forEach(b => {
    console.log(`Pos: ${b.grid_position?.padEnd(4)} | Code: ${(b.tracking_code || b.name).padEnd(10)} | Strain: ${b.genetics?.name}`);
  });
}

inspectRoom();
