const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function unlinkDeviceToFactory() {
  console.log("=== Unlinking TrazApp_A3F2 to Factory / Out-of-the-Box State in Supabase ===");

  const email = 'trazappadmin@admin.com';
  const password = 'Seba4794!';
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

  if (authErr) {
    console.error("Auth error:", authErr.message);
    return;
  }

  const deviceId = 'TrazApp_A3F2';
  const resetData = {
    alias: null,
    organization_id: null,
    user_id: null,
    room_id: null,
    bunker_name: null,
    is_provisioned: false,
    is_active: true,
  };

  const { data, error } = await supabase
    .from('trazapp_devices')
    .update(resetData)
    .eq('device_id', deviceId)
    .select();

  if (error) {
    console.error("Failed to reset device row:", error);
  } else {
    console.log("SUCCESS! Device TrazApp_A3F2 reset to factory state:", data);
  }
}

unlinkDeviceToFactory();
