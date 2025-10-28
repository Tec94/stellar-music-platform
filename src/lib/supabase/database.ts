import { getBrowserClient } from './client';
import type { Database } from './types';

function errorForMissingClient() {
  return { data: null, error: new Error('Supabase client not configured') } as const;
}

export async function getProfile(userId: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function upsertProfile(values: Partial<Database['public']['Tables']['profiles']['Row']>) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase.from('profiles').upsert(values).select('*').maybeSingle();
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getTiers() {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();
  const response = await supabase.from('tiers').select('*').order('priority', { ascending: true });
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getQuests() {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();
  const response = await supabase.from('quests').select('*').order('created_at', { ascending: false });
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function completeQuest(
  questId: string,
  userId: string,
  notes?: string,
  proofMediaId?: string
) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('quest_completions')
    .insert({
      quest_id: questId,
      user_id: userId,
      notes: notes ?? null,
      proof_media_id: proofMediaId ?? null,
    })
    .select('*')
    .maybeSingle();

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getUserQuestCompletions(userId: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('quest_completions')
    .select('*, quests(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getChatRooms() {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();
  const response = await supabase.from('chat_rooms').select('*').order('created_at', { ascending: true });
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getChatMessages(roomId: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('chat_messages')
    .select('*, profiles:author_id(username, avatar_path)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function sendChatMessage(roomId: string, authorId: string, content: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('chat_messages')
    .insert({ room_id: roomId, author_id: authorId, content })
    .select('*')
    .maybeSingle();

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function createMediaRecord(values: Partial<Database['public']['Tables']['media']['Row']>) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase.from('media').insert(values).select('*').maybeSingle();
  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function getNotifications(userId: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}

export async function markNotificationAsRead(id: string) {
  const supabase = getBrowserClient();
  if (!supabase) return errorForMissingClient();

  const response = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  return { data: response.data, error: response.error ? new Error(response.error.message) : null };
}
