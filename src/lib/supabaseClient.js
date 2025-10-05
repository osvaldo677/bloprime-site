// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptmprgtvhmdsdccveigt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bXByZ3R2aG1kc2RjY3ZlaWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDYzMzEsImV4cCI6MjA3NDI4MjMzMX0.q5rl76CmK8nLlrr1wtwkjqvlw1cEdvhl9yRjNO2r-VA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // 🔑 grava sessão no localStorage
    autoRefreshToken: true,      // 🔑 renova tokens
    detectSessionInUrl: true,    // 🔑 útil para magic links ou reset de password
    storageKey: "supabase.auth", // 🔑 nome fixo no localStorage
  },
});
