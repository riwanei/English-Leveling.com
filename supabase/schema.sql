-- =====================================================================
-- English Leveling — schéma de base de données Supabase
-- À coller en entier dans Supabase > SQL Editor > New query, puis "Run".
-- =====================================================================

-- ---------- Tables ----------------------------------------------------

-- Profil public d'un joueur (pseudo + XP pour les classements)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  xp          integer not null default 0 check (xp >= 0),
  created_at  timestamptz not null default now()
);

-- Sauvegarde complète de la progression (niveaux, quêtes, records…)
create table public.progress (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Guildes (groupes de 7 joueurs maximum)
create table public.guilds (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 30),
  code        text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  owner       uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.guild_members (
  guild_id    uuid not null references public.guilds(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (guild_id, user_id)
);
create index guild_members_user_idx on public.guild_members (user_id);

-- Messages du chat de guilde
create table public.messages (
  id          bigint generated always as identity primary key,
  guild_id    uuid not null references public.guilds(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  body        text not null check (char_length(body) between 1 and 400),
  kind        text not null default 'chat' check (kind in ('chat','join','leave','level')),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index messages_guild_idx on public.messages (guild_id, created_at desc);

-- Signalements de messages
create table public.reports (
  id          bigint generated always as identity primary key,
  message_id  bigint not null references public.messages(id) on delete cascade,
  reporter    uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (message_id, reporter)
);

-- ---------- Fonction utilitaire --------------------------------------

-- Vrai si l'utilisateur connecté fait partie de la guilde g
create or replace function public.is_member(g uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from guild_members where guild_id = g and user_id = auth.uid());
$$;

-- ---------- Sécurité : Row Level Security ----------------------------

alter table public.profiles      enable row level security;
alter table public.progress      enable row level security;
alter table public.guilds        enable row level security;
alter table public.guild_members enable row level security;
alter table public.messages      enable row level security;
alter table public.reports       enable row level security;

-- Profils : lisibles par les joueurs connectés, modifiables par leur propriétaire
create policy "profils lisibles" on public.profiles
  for select to authenticated using (true);
create policy "creer son profil" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "modifier son profil" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Progression : chacun ne voit et ne modifie que la sienne
create policy "sa progression" on public.progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Guildes et membres : visibles uniquement par les membres
-- (création, entrée et sortie passent par les fonctions plus bas)
create policy "voir ses guildes" on public.guilds
  for select to authenticated using (public.is_member(id));
create policy "voir les membres" on public.guild_members
  for select to authenticated using (public.is_member(guild_id));

-- Chat : lecture et écriture réservées aux membres, messages masqués exclus
create policy "lire le chat" on public.messages
  for select to authenticated using (public.is_member(guild_id) and not hidden);
create policy "ecrire dans le chat" on public.messages
  for insert to authenticated
  with check (user_id = auth.uid() and kind = 'chat' and public.is_member(guild_id));

-- Signalements : seulement sur un message d'une de ses guildes
create policy "signaler" on public.reports
  for insert to authenticated
  with check (
    reporter = auth.uid()
    and exists (select 1 from public.messages m where m.id = message_id and public.is_member(m.guild_id))
  );

-- ---------- Anti-spam et modération ----------------------------------

-- Pas plus de 5 messages en 15 secondes par joueur
create or replace function public.limit_messages() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.kind = 'chat' and (
    select count(*) from messages
    where user_id = new.user_id and created_at > now() - interval '15 seconds'
  ) >= 5 then
    raise exception 'SLOW_DOWN';
  end if;
  return new;
end $$;
create trigger messages_rate before insert on public.messages
  for each row execute function public.limit_messages();

-- Un message signalé par 2 joueurs différents est masqué automatiquement
create or replace function public.auto_hide() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from reports where message_id = new.message_id) >= 2 then
    update messages set hidden = true where id = new.message_id;
  end if;
  return new;
end $$;
create trigger reports_hide after insert on public.reports
  for each row execute function public.auto_hide();

-- ---------- Fonctions appelées par le site ---------------------------

-- Créer une guilde (5 guildes maximum par joueur)
create or replace function public.create_guild(p_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare g uuid; c text;
begin
  if auth.uid() is null then raise exception 'NOT_AUTH'; end if;
  if not exists (select 1 from profiles where id = auth.uid()) then raise exception 'NO_PROFILE'; end if;
  if (select count(*) from guild_members where user_id = auth.uid()) >= 5 then raise exception 'TOO_MANY_GUILDS'; end if;
  loop
    select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (floor(random() * 31) + 1)::int, 1), '')
      into c from generate_series(1, 6);
    exit when not exists (select 1 from guilds where code = c);
  end loop;
  insert into guilds (name, code, owner) values (trim(p_name), c, auth.uid()) returning id into g;
  insert into guild_members (guild_id, user_id) values (g, auth.uid());
  return g;
end $$;

-- Rejoindre une guilde avec son code (7 membres maximum)
create or replace function public.join_guild(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare g uuid; n int;
begin
  if auth.uid() is null then raise exception 'NOT_AUTH'; end if;
  if not exists (select 1 from profiles where id = auth.uid()) then raise exception 'NO_PROFILE'; end if;
  -- "for update" verrouille la guilde : deux joueurs ne peuvent pas prendre la 7e place en même temps
  select id into g from guilds where code = upper(trim(p_code)) for update;
  if g is null then raise exception 'NOT_FOUND'; end if;
  if exists (select 1 from guild_members where guild_id = g and user_id = auth.uid()) then return g; end if;
  if (select count(*) from guild_members where user_id = auth.uid()) >= 5 then raise exception 'TOO_MANY_GUILDS'; end if;
  select count(*) into n from guild_members where guild_id = g;
  if n >= 7 then raise exception 'GUILD_FULL'; end if;
  insert into guild_members (guild_id, user_id) values (g, auth.uid());
  insert into messages (guild_id, user_id, body, kind) values (g, auth.uid(), 'join', 'join');
  return g;
end $$;

-- Quitter une guilde (la guilde est supprimée si elle se vide ; le chef est remplacé s'il part)
create or replace function public.leave_guild(p_guild uuid) returns void
language plpgsql security definer set search_path = public as $$
declare next_owner uuid;
begin
  perform 1 from guilds where id = p_guild for update;
  delete from guild_members where guild_id = p_guild and user_id = auth.uid();
  if not found then return; end if;
  if not exists (select 1 from guild_members where guild_id = p_guild) then
    delete from guilds where id = p_guild;
    return;
  end if;
  insert into messages (guild_id, user_id, body, kind) values (p_guild, auth.uid(), 'leave', 'leave');
  if (select owner from guilds where id = p_guild) is not distinct from auth.uid() then
    select user_id into next_owner from guild_members where guild_id = p_guild order by joined_at limit 1;
    update guilds set owner = next_owner where id = p_guild;
  end if;
end $$;

-- Le chef retire un membre
create or replace function public.kick_member(p_guild uuid, p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if (select owner from guilds where id = p_guild) is distinct from auth.uid() then raise exception 'NOT_OWNER'; end if;
  if p_user = auth.uid() then raise exception 'NOT_SELF'; end if;
  delete from guild_members where guild_id = p_guild and user_id = p_user;
  if found then
    insert into messages (guild_id, user_id, body, kind) values (p_guild, p_user, 'leave', 'leave');
  end if;
end $$;

-- Annonce automatique "X a atteint le niveau N" dans toutes ses guildes
create or replace function public.announce_level(p_level int) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or p_level < 2 or p_level > 999 then return; end if;
  insert into messages (guild_id, user_id, body, kind)
    select guild_id, auth.uid(), p_level::text, 'level' from guild_members where user_id = auth.uid();
end $$;

-- Supprimer son compte et toutes ses données (droit à l'effacement, RGPD)
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
declare g record;
begin
  if auth.uid() is null then raise exception 'NOT_AUTH'; end if;
  for g in select guild_id from guild_members where user_id = auth.uid() loop
    perform public.leave_guild(g.guild_id);
  end loop;
  delete from auth.users where id = auth.uid();
end $$;

-- Les visiteurs non connectés ne peuvent appeler aucune fonction
revoke execute on function public.create_guild(text), public.join_guild(text), public.leave_guild(uuid),
  public.kick_member(uuid, uuid), public.announce_level(int), public.delete_my_account() from public, anon;
grant execute on function public.create_guild(text), public.join_guild(text), public.leave_guild(uuid),
  public.kick_member(uuid, uuid), public.announce_level(int), public.delete_my_account() to authenticated;

-- ---------- Temps réel (chat instantané) ------------------------------
alter publication supabase_realtime add table public.messages, public.guild_members;
