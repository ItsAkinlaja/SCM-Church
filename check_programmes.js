import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ofmnuvteaqxhbxyjpgis.supabase.co';
const supabaseKey = 'sb_publishable__pikRaO4f0G76ecTQO6FUg_WuhJDRM8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  const { data: programmes, error } = await supabase.from('programmes').select('*');
  if (error) {
    console.error('Error fetching programmes:', error);
    return;
  }

  console.log('--- ALL PROGRAMMES ---');
  programmes.forEach(p => {
    console.log(`[${p.id}] "${p.title}" | ${p.occurrence} | ${p.day_of_week} | ${p.time}`);
  });
}

checkDuplicates();
