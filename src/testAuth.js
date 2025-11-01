import { supabase } from "./lib/supabaseClient";

(async () => {
  const { data, error } = await supabase.rpc("debug_auth_info");
  console.log("🔍 debug_auth_info:", data, error);
})();
