const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, anonKey);

async function checkDevice() {
  // Let's call an RPC or test query to see trazapp_devices
  const { data, error } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'TrazApp_A3F2' });
  console.log("Device meta:", data, error);
}

checkDevice();
