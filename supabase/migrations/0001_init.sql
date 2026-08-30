-- // supabase/migrations/0001_init.sql — Ny fil — grundskema: kanaler, videoer, resuméer, genereret indhold + RLS

create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  youtube_channel_id text not null,
  channel_title text,
  provider_refresh_token text,
  created_at timestamptz not null default now(),
  unique (user_id, youtube_channel_id)
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channels(id) on delete cascade,
  youtube_video_id text not null,
  title text,
  status text,
  created_at timestamptz not null default now(),
  unique (channel_id, youtube_video_id)
);

create table if not exists video_summaries (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  summary text not null,
  created_at timestamptz not null default now(),
  unique (video_id)
);

create table if not exists video_generations (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  titles jsonb not null,
  description text,
  tags jsonb,
  chapters jsonb,
  community_post text,
  created_at timestamptz not null default now()
);

alter table channels enable row level security;
alter table videos enable row level security;
alter table video_summaries enable row level security;
alter table video_generations enable row level security;

create policy "Users can manage their own channels"
  on channels for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can access videos on their channels"
  on videos for all
  using (
    exists (
      select 1 from channels
      where channels.id = videos.channel_id
      and channels.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from channels
      where channels.id = videos.channel_id
      and channels.user_id = auth.uid()
    )
  );

create policy "Users can access summaries on their videos"
  on video_summaries for all
  using (
    exists (
      select 1 from videos
      join channels on channels.id = videos.channel_id
      where videos.id = video_summaries.video_id
      and channels.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from videos
      join channels on channels.id = videos.channel_id
      where videos.id = video_summaries.video_id
      and channels.user_id = auth.uid()
    )
  );

create policy "Users can access generations on their videos"
  on video_generations for all
  using (
    exists (
      select 1 from videos
      join channels on channels.id = videos.channel_id
      where videos.id = video_generations.video_id
      and channels.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from videos
      join channels on channels.id = videos.channel_id
      where videos.id = video_generations.video_id
      and channels.user_id = auth.uid()
    )
  );
