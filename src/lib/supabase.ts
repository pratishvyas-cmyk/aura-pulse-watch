import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://voaydhehtyckssuvwokq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXlkaGVodHlja3NzdXZ3b2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTAzNjAsImV4cCI6MjA4ODUyNjM2MH0.f53jj2Nk3CR1PTOFpZHeiBBEfDnQJUDpqLgKrjhNGIo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
