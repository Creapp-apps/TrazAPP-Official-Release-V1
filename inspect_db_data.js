const { createClient } = require('@supabase/supabase-js');

const url = 'https://fnzxjpynuijjxxpcpqtd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuenhqcHludWlqanh4cGNwcXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDc3MzYsImV4cCI6MjA4NzAyMzczNn0.1qgAvml5ATk6Hk_CfHTG7w97fIYgL_SXwxxrffM-tf4';

const supabase = createClient(url, key);

async function run() {
  console.log("=== ROOMS ===");
  const { data: rooms, error: errR } = await supabase.from('rooms').select('*, batches(*, genetic:genetics(*)), clone_maps(*)');
  if (errR) console.error("Error rooms:", errR);
  else console.log(JSON.stringify(rooms, null, 2));

  console.log("=== TRAZAPP DEVICES ===");
  const { data: devices, error: errD } = await supabase.from('trazapp_devices').select('*');
  if (errD) console.error("Error devices:", errD);
  else console.log(JSON.stringify(devices, null, 2));

  console.log("=== BATCHES ===");
  const { data: batches, error: errB } = await supabase.from('batches').select('*, genetic:genetics(*)');
  if (errB) console.error("Error batches:", errB);
  else console.log(JSON.stringify(batches, null, 2));
}

run();
