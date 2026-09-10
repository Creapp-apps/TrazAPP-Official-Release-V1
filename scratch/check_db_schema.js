const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function check() {
  const { data, error } = await supabase
    .from('batches')
    .select('id, name, tracking_code, stage, grid_position, current_room_id, quantity')
    .is('discarded_at', null)
    .limit(20);
  console.log("Batches sample:", data, error);
}

check();
