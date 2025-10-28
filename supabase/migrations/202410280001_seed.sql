-- Seed tiers
insert into public.tiers (slug, name, description, priority, monthly_price_cents, annual_price_cents, benefits, is_default) values
  ('bronze', 'Bronze', 'Free tier with basic access', 0, 0, 0, array['General chat access', 'View public quests', 'Basic profile'], true),
  ('silver', 'Silver', 'Enhanced access', 1, 999, 9990, array['All Bronze', 'Join exclusive quests', '10GB storage', 'Priority support'], false),
  ('gold', 'Gold', 'Premium experience', 2, 1999, 19990, array['All Silver', 'Create custom quests', '50GB storage', 'Early event access'], false),
  ('platinum', 'Platinum', 'Elite access', 3, 4999, 49990, array['All Gold', 'Unlimited storage', 'Private coaching', 'Exclusive events'], false),
  ('diamond', 'Diamond', 'Lifetime access', 4, 0, 0, array['All Platinum', 'Lifetime access', 'VIP support', 'Beta features'], false)
  on conflict (slug) do nothing;

-- Seed achievements
insert into public.achievements (slug, name, description, xp_reward) values
  ('account-created', 'Welcome Adventurer', 'Created your account', 50),
  ('profile-completed', 'Identity Forged', 'Completed profile setup', 150),
  ('first-quest', 'Quest Beginner', 'Completed first quest', 500),
  ('first-upload', 'Memory Keeper', 'Uploaded first media', 100),
  ('first-chat', 'Social Butterfly', 'Sent first chat message', 50),
  ('tier-upgraded', 'Level Up', 'Upgraded to premium tier', 1000),
  ('five-quests', 'Quest Explorer', 'Completed 5 quests', 2000),
  ('ten-quests', 'Quest Veteran', 'Completed 10 quests', 5000),
  ('event-attendee', 'Event Participant', 'Attended first event', 250)
  on conflict (slug) do nothing;

-- Seed quests
insert into public.quests (slug, title, summary, description, xp_reward, max_completions) values
  ('onboarding-quest', 'Getting Started', 'Complete your profile and explore',
   'Guide to setting up profile, exploring dashboard, and joining community.', 150, 1),
  ('first-upload', 'Share Your Journey', 'Upload your first media',
   'Share a photo or video that represents your adventure spirit.', 100, 1),
  ('community-intro', 'Meet the Community', 'Introduce yourself',
   'Join general chat and introduce yourself to fellow adventurers.', 50, 1),
  ('weekly-challenge', 'Weekly Exploration', 'Complete weekly challenge',
   'Check announcements and submit your completion!', 500, null)
  on conflict (slug) do nothing;

-- Seed chat rooms
insert into public.chat_rooms (slug, name, description, is_private) values
  ('general', 'General Chat', 'Main community discussion', false),
  ('quests', 'Quest Talk', 'Discuss quests and tips', false),
  ('media', 'Media Showcase', 'Share and discuss media', false),
  ('announcements', 'Announcements', 'Official platform announcements', false)
  on conflict (slug) do nothing;
