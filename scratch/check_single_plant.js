const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function checkSinglePlant() {
  const { data } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'bunker_7in_01' });
  console.log("Sample plant 0:", JSON.stringify(data.plants[0], null, 2));
}

checkSinglePlant();
