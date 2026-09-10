const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function checkBatches() {
  const roomId = 'dbf2bf0b-c2e8-48bc-a17c-d590b1512661';
  const { data: batches, error } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, created_at, genetics(name)')
    .eq('current_room_id', roomId)
    .is('discarded_at', null)
    .order('grid_position', { ascending: true });

  console.log("Total active batches in bunker:", batches.length);
  batches.forEach(b => {
    console.log(`ID: ${b.id} | Pos: ${b.grid_position} | Code: ${b.tracking_code || b.name} | Strain: ${b.genetics?.name}`);
  });
}

checkBatches();
