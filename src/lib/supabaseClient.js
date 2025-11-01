// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,     // mantém sessão se quiseres usar reset de password, etc.
    autoRefreshToken: true,
    detectSessionInUrl: false // sem magic links -> mais previsível
  },
});

console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 10) + "...");

