export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface TableRow<Table> {
  Row: Table;
  Insert: Partial<Table>;
  Update: Partial<Table>;
}

export interface Database {
  public: {
    Tables: {
      profiles: TableRow<{
        id: string;
        username: string | null;
        full_name: string | null;
        bio: string | null;
        avatar_path: string | null;
        banner_path: string | null;
        xp: number;
        quests_completed: number;
        achievements_completed: number;
        tier_id: string | null;
        role: 'member' | 'moderator' | 'admin';
        onboarding_completed_at: string | null;
        last_seen_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      tiers: TableRow<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        priority: number;
        monthly_price_cents: number;
        annual_price_cents: number | null;
        currency: string;
        benefits: string[];
        is_default: boolean;
        created_at: string;
        updated_at: string;
      }>;
      media: TableRow<{
        id: string;
        owner_id: string;
        bucket: string;
        path: string;
        type: 'image' | 'video' | 'audio' | 'document';
        status: 'processing' | 'ready' | 'failed';
        size_bytes: number | null;
        checksum: string | null;
        metadata: Json;
        created_at: string;
        updated_at: string;
      }>;
      chat_rooms: TableRow<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        is_private: boolean;
        created_by: string | null;
        created_at: string;
      }>;
      chat_members: TableRow<{
        room_id: string;
        user_id: string;
        joined_at: string;
      }>;
      chat_messages: TableRow<{
        id: string;
        room_id: string;
        author_id: string;
        content: string;
        metadata: Json;
        created_at: string;
        edited_at: string | null;
      }>;
      quests: TableRow<{
        id: string;
        slug: string;
        title: string;
        summary: string | null;
        description: string | null;
        xp_reward: number;
        tier_requirement: string | null;
        max_completions: number | null;
        starts_at: string | null;
        ends_at: string | null;
        metadata: Json;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      quest_completions: TableRow<{
        id: string;
        quest_id: string;
        user_id: string;
        proof_media_id: string | null;
        notes: string | null;
        reward_claimed: boolean;
        completed_at: string;
      }>;
      achievements: TableRow<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        icon_path: string | null;
        xp_reward: number;
        tier_requirement: string | null;
        metadata: Json;
        created_at: string;
      }>;
      user_achievements: TableRow<{
        id: string;
        achievement_id: string;
        user_id: string;
        metadata: Json;
        earned_at: string;
      }>;
      subscriptions: TableRow<{
        id: string;
        user_id: string;
        tier_id: string;
        status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
        stripe_customer_id: string | null;
        stripe_subscription_id: string | null;
        current_period_start: string | null;
        current_period_end: string | null;
        cancel_at: string | null;
        canceled_at: string | null;
        metadata: Json;
        created_at: string;
        updated_at: string;
      }>;
      orders: TableRow<{
        id: string;
        user_id: string;
        status: 'pending' | 'paid' | 'refunded' | 'failed';
        total_cents: number;
        currency: string;
        stripe_payment_intent_id: string | null;
        stripe_checkout_session_id: string | null;
        metadata: Json;
        created_at: string;
        updated_at: string;
      }>;
      order_items: TableRow<{
        id: string;
        order_id: string;
        description: string | null;
        quantity: number;
        unit_amount_cents: number;
        metadata: Json;
      }>;
      events: TableRow<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        location: string | null;
        starts_at: string;
        ends_at: string | null;
        tier_requirement: string | null;
        capacity: number | null;
        metadata: Json;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      event_registrations: TableRow<{
        id: string;
        event_id: string;
        user_id: string;
        status: string;
        checked_in_at: string | null;
        metadata: Json;
        created_at: string;
      }>;
      notifications: TableRow<{
        id: string;
        user_id: string;
        type: string;
        payload: Json;
        read_at: string | null;
        created_at: string;
      }>;
      activity_logs: TableRow<{
        id: string;
        actor_id: string | null;
        user_id: string | null;
        event: string;
        context: Json;
        created_at: string;
      }>;
      broadcasts: TableRow<{
        id: string;
        title: string;
        body: string;
        target: Json;
        channel: string;
        scheduled_for: string | null;
        sent_at: string | null;
        created_by: string | null;
        created_at: string;
      }>;
    };
  };
}
