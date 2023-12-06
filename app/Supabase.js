import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://jodeshwvvazygrhugayg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZGVzaHd2dmF6eWdyaHVnYXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE3MTg4NDUsImV4cCI6MjAxNzI5NDg0NX0.6mVKtRJ4hx_oADqt8MdM66Tcr_LEEaho3fBYY2bk_4M";

export default supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
