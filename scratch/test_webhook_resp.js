const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function testWebhook() {
  const deviceId = 'TrazApp_A3F2';
  const webhookUrl = process.env.REACT_APP_SUPABASE_URL + '/functions/v1/trazapp-telemetry';
  const testPayload = {
    device: 'TrazApp_35',
    device_id: deviceId,
    token: '8f3a1b2c4d5e6f7091a2b3c4d5e6f708',
    firmware: 'v6.0-PRO-3.5',
    uptime_s: 100,
    sensors: { temp_c: 24.5, hum_pct: 60.0, soil_pct: 45.0, vpd_kpa: 1.15 },
    vpd: { stage: 3, stage_name: 'Floracion', in_range: true, vpd_low: false, vpd_min: 1.0, vpd_max: 1.5 },
    meta: { temp_real: true, hum_real: true, soil_real: true, rssi_dbm: -55, ip: '192.168.1.50' }
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
      'X-Device-ID': deviceId,
      'X-Device-Secret': '8f3a1b2c4d5e6f7091a2b3c4d5e6f708',
    },
    body: JSON.stringify(testPayload)
  });

  const resData = await res.json();
  console.log("Webhook Response JSON:", JSON.stringify(resData, null, 2));
}

testWebhook();
