import { getBrowserClient } from './client';

interface SubscribeOptions {
  table: 'chat_messages' | 'notifications' | 'user_achievements' | 'quest_completions';
  filter?: Record<string, string>;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onPayload: (payload: any) => void;
  onStatusChange?: (status: string) => void;
}

export function subscribeToTable(table: string, options: SubscribeOptions) {
  const supabase = getBrowserClient();
  if (!supabase) {
    return { unsubscribe: () => undefined };
  }

  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: options.event || '*',
        schema: 'public',
        table,
        filter: options.filter ? Object.entries(options.filter).map(([key, value]) => `${key}=eq.${value}`).join(',') : undefined,
      },
      (payload) => {
        options.onPayload(payload);
      }
    )
    .subscribe((status) => {
      if (options.onStatusChange) {
        options.onStatusChange(status);
      }
    });

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
