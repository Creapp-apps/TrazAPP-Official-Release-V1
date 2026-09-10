const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function findZp() {
  const { data: batches, error } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, current_room_id, quantity, genetics(name)')
    .or('tracking_code.ilike.%ZP%,name.ilike.%ZP%,tracking_code.ilike.%zoap%,name.ilike.%zoap%');

  console.log("ZOAP / ZP batches:", batches, error);
}

findZp();
