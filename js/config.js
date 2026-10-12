// =====================================================================
// Configuration du mode en ligne (comptes, guildes, chat)
// Remplace les deux valeurs par celles de TON projet Supabase :
// Supabase > Project Settings > API (ou "Connect")
//   - Project URL      → SUPABASE_URL
//   - anon public key  → SUPABASE_ANON_KEY
// La clé "anon" est faite pour être publique : ce sont les règles RLS
// du fichier supabase/schema.sql qui protègent les données.
// Ne mets JAMAIS ici la clé "service_role".
// Tant que ces valeurs ne sont pas remplies, le site marche en mode solo.
// =====================================================================
export const SUPABASE_URL = "COLLE_ICI_TON_PROJECT_URL";
export const SUPABASE_ANON_KEY = "COLLE_ICI_TA_CLE_ANON";
