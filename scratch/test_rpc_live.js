const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function test() {
  console.log("Comprobando si get_device_bunker_meta devuelve grid_position...");
  const { data, error } = await supabase.rpc('get_device_bunker_meta', { p_device_id: 'bunker_7in_01' });
  if (error) {
    console.error("Error al llamar RPC:", error);
    return;
  }
  console.log("Respuesta de Supabase:");
  console.log(`- Sala: ${data.room_name}`);
  console.log(`- Cantidad de plantas recibidas: ${data.plants?.length || 0}`);
  if (data.plants && data.plants.length > 0) {
    console.log("Muestra de primeras 5 plantas con su coordenada:");
    data.plants.slice(0, 5).forEach((p, idx) => {
      console.log(`  ${idx + 1}. Código: ${p.name} | Variedad: ${p.strain} | Spot: ${p.grid_position || '[SIN POSICION]'}`);
    });
    const hasGridPos = data.plants.some(p => p.grid_position && p.grid_position.length > 0);
    if (hasGridPos) {
      console.log("\n✅ ¡ÉXITO! Supabase ya está enviando las coordenadas reales grid_position.");
    } else {
      console.log("\n⚠️ Aún no se ha corrido el SQL en Supabase (grid_position sigue vacío).");
    }
  }
}

test();
