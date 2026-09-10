const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function check() {
  const roomId = 'dbf2bf0b-c2e8-48bc-a17c-d590b1512661';
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, created_at, clone_map_id, genetics(name)')
    .eq('current_room_id', roomId)
    .is('discarded_at', null)
    .order('created_at', { ascending: false });

  console.log("All batches in Bunker:");
  batches.forEach(b => {
    console.log(`Code: ${(b.tracking_code || b.name).padEnd(10)} | Strain: ${(b.genetics?.name || '').padEnd(15)} | Pos: ${(b.grid_position || '').padEnd(4)} | Created: ${b.created_at} | map_id: ${b.clone_map_id}`);
  });
}

check();
