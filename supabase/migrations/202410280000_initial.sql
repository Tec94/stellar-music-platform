-- Enable extensions
create extension if not exists "uuid-ossp" with schema public;
create extension if not exists pgcrypto with schema public;

-- Enum definitions
create type public.media_type as enum ('image', 'video', 'audio', 'document');
create type public.media_status as enum ('processing', 'ready', 'failed');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
create type public.order_status as enum ('pending', 'paid', 'refunded', 'failed');
create type public.member_role as enum ('member', 'moderator', 'admin');

-- Tiers
create table public.tiers (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  priority smallint not null default 0,
  monthly_price_cents integer not null default 0,
  annual_price_cents integer,
  currency char(3) not null default 'USD',
  benefits text[] not null default '{}',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext unique,
  full_name text,
  bio text,
  avatar_path text,
  banner_path text,
  xp integer not null default 0,
  quests_completed integer not null default 0,
  achievements_completed integer not null default 0,
  tier_id uuid references public.tiers(id) on delete set null,
  role public.member_role not null default 'member',
  onboarding_completed_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Media
create table public.media (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  path text not null,
  type public.media_type not null,
  status public.media_status not null default 'processing',
  size_bytes bigint,
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_owner_idx on public.media(owner_id);

-- Chat rooms and messages
create table public.chat_rooms (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  is_private boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.chat_members (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index chat_messages_room_idx on public.chat_messages(room_id, created_at desc);

-- Quests
create table public.quests (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  summary text,
  description text,
  xp_reward integer not null default 0,
  tier_requirement uuid references public.tiers(id) on delete set null,
  max_completions integer,
  starts_at timestamptz,
  ends_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quest_completions (
  id uuid primary key default uuid_generate_v4(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  proof_media_id uuid references public.media(id) on delete set null,
  notes text,
  reward_claimed boolean not null default false,
  completed_at timestamptz not null default now(),
  unique (quest_id, user_id)
);

-- Achievements
create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  icon_path text,
  xp_reward integer not null default 0,
  tier_requirement uuid references public.tiers(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  metadata jsonb not null default '{}'::jsonb,
  earned_at timestamptz not null default now(),
  unique (achievement_id, user_id)
);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier_id uuid not null references public.tiers(id) on delete restrict,
  status public.subscription_status not null default 'trialing',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stripe_subscription_id)
);

-- Orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.order_status not null default 'pending',
  total_cents integer not null,
  currency char(3) not null default 'USD',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_idx on public.orders(user_id);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  description text,
  quantity integer not null default 1,
  unit_amount_cents integer not null,
  metadata jsonb not null default '{}'::jsonb
);
create index order_items_order_idx on public.order_items(order_id);

-- Events
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  tier_requirement uuid references public.tiers(id) on delete set null,
  capacity integer,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'registered',
  checked_in_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Notifications & activity
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create table public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references auth.users(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index activity_logs_user_idx on public.activity_logs(user_id, created_at desc);

create table public.broadcasts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  target jsonb not null default '{}'::jsonb,
  channel text not null default 'email',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Helper functions
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists(
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

create or replace function public.has_tier(required_tier uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = auth.uid()
      and s.tier_id = required_tier
      and s.status = 'active'
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.media enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_members enable row level security;
alter table public.chat_messages enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.broadcasts enable row level security;

drop policy if exists "Profiles public read" on public.profiles;
create policy "Profiles public read" on public.profiles for select using (true);
create policy "Profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "Profiles admin manage" on public.profiles using (public.is_admin());

create policy "Media owner manage" on public.media
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Chat rooms view" on public.chat_rooms
  for select using (
    not is_private or public.is_admin() or exists (
      select 1 from public.chat_members cm
      where cm.room_id = public.chat_rooms.id
        and cm.user_id = auth.uid()
    )
  );
create policy "Chat rooms manage" on public.chat_rooms using (public.is_admin());

create policy "Chat members self" on public.chat_members
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Chat messages members" on public.chat_messages
  using (
    exists (
      select 1
      from public.chat_members cm
      where cm.room_id = public.chat_messages.room_id
        and cm.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.chat_members cm
      where cm.room_id = public.chat_messages.room_id
        and cm.user_id = auth.uid()
    )
  );

create policy "Quests readable" on public.quests for select using (true);
create policy "Quests admin" on public.quests using (public.is_admin());

create policy "Quest completions self" on public.quest_completions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Achievements readable" on public.achievements for select using (true);
create policy "User achievements self" on public.user_achievements
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Subscriptions self" on public.subscriptions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Subscriptions admin" on public.subscriptions using (public.is_admin());

create policy "Orders self" on public.orders using (auth.uid() = user_id);
create policy "Orders admin" on public.orders using (public.is_admin());

create policy "Order items self" on public.order_items
  using (exists (
    select 1 from public.orders o
    where o.id = public.order_items.order_id
      and o.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.orders o
    where o.id = public.order_items.order_id
      and o.user_id = auth.uid()
  ));

create policy "Events view" on public.events
  for select using (
    public.is_admin()
    or tier_requirement is null
    or public.has_tier(tier_requirement)
  );
create policy "Events admin" on public.events using (public.is_admin());

create policy "Event registrations self" on public.event_registrations
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notifications self" on public.notifications
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Activity self" on public.activity_logs for select using (auth.uid() = user_id);
create policy "Activity admin" on public.activity_logs using (public.is_admin());

create policy "Broadcasts view" on public.broadcasts for select using (
  public.is_admin() or (target ->> 'type') is null or (target ->> 'type') = 'all'
);
create policy "Broadcasts admin" on public.broadcasts using (public.is_admin());

-- Trigger helper
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tiers_updated
before update on public.tiers
for each row execute function public.touch_updated_at();

create trigger profiles_updated
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger media_updated
before update on public.media
for each row execute function public.touch_updated_at();

create trigger quests_updated
before update on public.quests
for each row execute function public.touch_updated_at();

create trigger subscriptions_updated
before update on public.subscriptions
for each row execute function public.touch_updated_at();

create trigger orders_updated
before update on public.orders
for each row execute function public.touch_updated_at();

create trigger events_updated
before update on public.events
for each row execute function public.touch_updated_at();
