const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function checkCurrentState() {
  const email = 'trazappadmin@admin.com';
  const password = 'Seba4794!';
  const { data: authData } = await supabase.auth.signInWithPassword({ email, password });

  const { data, error } = await supabase
    .from('trazapp_devices')
    .select('*')
    .eq('device_id', 'TrazApp_A3F2');

  console.log("Current DB row for TrazApp_A3F2:", data);
}

checkCurrentState();
