const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function testRpc() {
  console.log("=== Testing get_device_bunker_meta RPC ===");
  const { data, error } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'TrazApp_A3F2' });
  if (error) {
    console.error("RPC test failed (function may not exist yet):", error);
  } else {
    console.log("RPC Output:", JSON.stringify(data, null, 2));
  }
}

testRpc();
