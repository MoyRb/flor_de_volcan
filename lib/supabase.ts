const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function querySupabase(table: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: "Supabase env vars are not configured" };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return { data: null, error: `Supabase request failed (${response.status})` };
  }

  const data = await response.json();
  return { data, error: null };
}
