# Database Schema

## Tables

### `public.profiles`
Stores user profile and progress.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References `auth.users(id)` |
| username | citext | Unique username |
| full_name | text | Display name |
| bio | text | Profile bio |
| avatar_path | text | Avatar location in storage |
| banner_path | text | Banner location in storage |
| xp | int | Experience points |
| quests_completed | int | Quest completion count |
| achievements_completed | int | Achievement count |
| tier_id | uuid | Current tier |
| role | member_role | member/moderator/admin |
| onboarding_completed_at | timestamptz | Onboarding completion timestamp |
| last_seen_at | timestamptz | Last activity timestamp |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

**RLS:** Anyone can read, users can update their own, admins can manage all.

### `public.tiers`
Membership tier definitions (Bronze, Silver, Gold, Platinum, Diamond).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | Unique identifier |
| name | text | Display name |
| description | text | Marketing description |
| priority | smallint | Sort order |
| monthly_price_cents | int | Monthly subscription price (cents) |
| annual_price_cents | int | Annual subscription price (cents) |
| currency | char(3) | Currency code (USD) |
| benefits | text[] | List of benefits |
| is_default | boolean | Default for new users |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### `public.media`
User-uploaded media files.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| owner_id | uuid | References `auth.users(id)` |
| bucket | text | Storage bucket name |
| path | text | File path in bucket |
| type | media_type | image/video/audio/document |
| status | media_status | processing/ready/failed |
| size_bytes | bigint | File size |
| checksum | text | File checksum |
| metadata | jsonb | Arbitrary metadata |
| created_at | timestamptz | Upload timestamp |
| updated_at | timestamptz | Update timestamp |

**RLS:** Owners can manage their own media.

### `public.chat_rooms`, `public.chat_members`, `public.chat_messages`
Chat system tables.

- **chat_rooms:** Room metadata and privacy settings
- **chat_members:** Join table mapping users to rooms
- **chat_messages:** Messages with author and content

**RLS:** Members can read/write in rooms they've joined.

### `public.quests`, `public.quest_completions`
Quest system.

- **quests:** Quest definitions, XP rewards, tier requirements
- **quest_completions:** Tracks user quest completions

**RLS:** Quests are readable by all, completions are self-managed.

### `public.achievements`, `public.user_achievements`
Achievement system.

- **achievements:** Achievement definitions
- **user_achievements:** Unlocked achievements per user

**RLS:** Achievements readable by all, user_achievements self-managed.

### `public.subscriptions`
Tracks active and past Stripe subscriptions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References `auth.users(id)` |
| tier_id | uuid | References `tiers(id)` |
| status | subscription_status | trialing/active/past_due/canceled/incomplete |
| stripe_customer_id | text | Stripe customer ID |
| stripe_subscription_id | text | Stripe subscription ID |
| current_period_start | timestamptz | Billing period start |
| current_period_end | timestamptz | Billing period end |
| cancel_at | timestamptz | Scheduled cancellation |
| canceled_at | timestamptz | Cancellation timestamp |
| metadata | jsonb | Additional data |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

**RLS:** Users can view their own subscriptions; admins can manage all.

### `public.orders`, `public.order_items`
Payment orders and line items.

**RLS:** Users can view their own orders; admins can manage all.

### `public.events`, `public.event_registrations`
Event management and attendee tracking.

**RLS:** Events are readable if user meets tier requirement. Registrations are self-managed.

### `public.notifications`
User-specific notifications.

**RLS:** Users manage their own notifications.

### `public.activity_logs`
System-wide activity logging.

**RLS:** Users can read their own activity; admins can read all.

### `public.broadcasts`
Platform-wide messages.

**RLS:** Admins manage; users read targeted messages.

## Helper Functions

- **`public.is_admin()`:** Returns true if current user has admin role
- **`public.has_tier(required_tier uuid)`:** Returns true if user has an active subscription to the specified tier

## Indexes

- `media_owner_idx` on `media(owner_id)`
- `chat_messages_room_idx` on `chat_messages(room_id, created_at desc)`
- `orders_user_idx` on `orders(user_id)`
- `order_items_order_idx` on `order_items(order_id)`
- `notifications_user_idx` on `notifications(user_id, created_at desc)`
- `activity_logs_user_idx` on `activity_logs(user_id, created_at desc)`

## Triggers

- `touch_updated_at()` automatically updates `updated_at` on row UPDATE for all relevant tables.
