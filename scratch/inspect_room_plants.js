const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function inspectRoomData() {
  const roomId = "dbf2bf0b-c2e8-48bc-a17c-d590b1512661"; // Bunker
  console.log("=== Inspecting Room ===");
  const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single();
  console.log("Room:", JSON.stringify(room, null, 2));

  console.log("=== Inspecting Batches in Room ===");
  const { data: batches } = await supabase.from('batches').select('*').eq('current_room_id', roomId).is('discarded_at', null);
  console.log("Batches:", JSON.stringify(batches, null, 2));
}

inspectRoomData();
