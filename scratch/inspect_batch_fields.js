const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function inspectBatchFields() {
  const { data: batch, error } = await supabase
    .from('batches')
    .select('*, genetics(*)')
    .eq('tracking_code', 'LC-014')
    .single();

  console.log("Full Batch sample for LC-014:", JSON.stringify(batch, null, 2));
}

inspectBatchFields();
