const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function printAll50() {
  const { data } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'bunker_7in_01' });
  console.log(`Total plantas recibidas: ${data.plants.length}`);
  
  // Agrupar por fila A, B, C, D, E
  const rows = { 'A': [], 'B': [], 'C': [], 'D': [], 'E': [] };
  data.plants.forEach(p => {
    const r = p.grid_position[0];
    if (rows[r]) rows[r].push(p);
  });

  for (let r of ['A', 'B', 'C', 'D', 'E']) {
    console.log(`\n--- FILA ${r} (${rows[r].length} plantas) ---`);
    rows[r].forEach(p => {
      console.log(`  Spot ${p.grid_position.padEnd(4)}: ${p.name.padEnd(10)} [${p.strain}]`);
    });
  }
}

printAll50();
