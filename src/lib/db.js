import { createClient } from '@supabase/supabase-js';
import { goto } from '$app/navigation';

const db = createClient(
  import.meta.env.VITE_SUPABASE_URL.toString(),
  import.meta.env.VITE_SUPABASE_ANON_KEY.toString()
);

export default db;