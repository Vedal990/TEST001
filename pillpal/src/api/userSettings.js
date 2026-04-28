import { supabase, assertNoSupabaseError } from "@/api/supabaseClient";

export const FONT_SCALE_NORMAL = 100;
export const FONT_SCALE_LARGE = 140;

export const fontScaleToPx = (scale) => {
  // Keep it simple: 100 -> 16px, 140 -> 22px
  if (Number(scale) >= 140) return "22px";
  return "16px";
};

export async function getUserSettings(userId) {
  if (!userId) return null;

  const res = await supabase
    .from("user_settings")
    .select("user_id,sound_enabled,font_scale,updated_at")
    .eq("user_id", userId)
    .limit(1);

  assertNoSupabaseError(res);
  return res.data?.[0] || null;
}

export async function upsertUserSettings(userId, defaults) {
  if (!userId) return null;

  // Prefer merge duplicates so it behaves like upsert
  const res = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: userId,
        ...defaults,
      },
      { onConflict: "user_id" }
    )
    .select("user_id,sound_enabled,font_scale,updated_at")
    .single();

  assertNoSupabaseError(res);
  return res.data;
}

export async function updateUserSettings(userId, patch) {
  if (!userId) return null;

  const res = await supabase
    .from("user_settings")
    .update(patch)
    .eq("user_id", userId)
    .select("user_id,sound_enabled,font_scale,updated_at")
    .single();

  assertNoSupabaseError(res);
  return res.data;
}