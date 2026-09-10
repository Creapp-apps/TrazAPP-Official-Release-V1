const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function inspectTables() {
  const email = 'trazappadmin@admin.com';
  const password = 'Seba4794!';
  await supabase.auth.signInWithPassword({ email, password });

  const roomId = 'dbf2bf0b-c2e8-48bc-a17c-d590b1512661';

  console.log("=== Inspecting batches sample row ===");
  const { data: bData, error: bErr } = await supabase.from('batches').select('*').eq('current_room_id', roomId).limit(1);
  if (bErr) console.error("batches err:", bErr);
  else console.log("batches row keys:", bData[0] ? Object.keys(bData[0]) : "No rows", bData[0]);

  console.log("\n=== Inspecting chakra_tasks sample row ===");
  const { data: tData, error: tErr } = await supabase.from('chakra_tasks').select('*').eq('room_id', roomId).limit(1);
  if (tErr) console.error("chakra_tasks err:", tErr);
  else console.log("chakra_tasks row keys:", tData[0] ? Object.keys(tData[0]) : "No rows", tData[0]);
}

inspectTables();
