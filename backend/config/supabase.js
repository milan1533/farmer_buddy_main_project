// config/supabase.js
// Supabase client - replaces MongoDB/Mongoose
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

// Service role client - full DB access (use in backend only, never expose to frontend)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Anon client - for public operations
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export const connectDB = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase Connected Successfully!');
    console.log(`🌐 Project URL: ${supabaseUrl}`);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    throw error;
  }
};

export default supabase;
