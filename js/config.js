// =====================================================================
// Configuration du mode en ligne (comptes, guildes, chat)
// Valeurs de TON projet Supabase : Project Settings > API Keys
//   - Project URL      → SUPABASE_URL
//   - Publishable key  → SUPABASE_ANON_KEY (ou l'ancienne clé "anon public")
// Cette clé est faite pour être publique : ce sont les règles RLS
// du fichier supabase/schema.sql qui protègent les données.
// Ne mets JAMAIS ici la clé "secret" / "service_role".
// =====================================================================
export const SUPABASE_URL = "https://bqeyxdppvgzepqhupouh.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_ISkDsJlq825QKrRB0u4syw_LoLl-Dht";
