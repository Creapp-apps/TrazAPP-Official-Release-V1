const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function checkExact() {
  // Test RPC first to see what get_device_bunker_meta returns RIGHT NOW
  const { data: rpcData, error: rpcErr } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'bunker_7in_01' });
  console.log("RPC bunker_7in_01:", JSON.stringify(rpcData, null, 2), rpcErr);

  const { data: rpcData2, error: rpcErr2 } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'TrazApp_A3F2' });
  console.log("RPC TrazApp_A3F2:", JSON.stringify(rpcData2, null, 2), rpcErr2);
}

checkExact();
