-- =====================================================================
-- English Leveling — espace « Avis » (notes et commentaires sur le jeu)
-- À coller dans Supabase > SQL Editor > New query, puis "Run".
-- À exécuter UNE seule fois, APRÈS schema.sql.
-- =====================================================================

-- Un avis par joueur (il peut le modifier ou le supprimer)
create table public.reviews (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  body        text not null check (char_length(body) between 3 and 600),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Signalements d'avis
create table public.review_reports (
  review_user uuid not null references public.reviews(user_id) on delete cascade,
  reporter    uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (review_user, reporter)
);

alter table public.reviews        enable row level security;
alter table public.review_reports enable row level security;

-- Chaque joueur lit, crée, modifie et supprime uniquement SON avis.
-- (La liste publique passe par la fonction get_reviews plus bas.)
create policy "lire son avis" on public.reviews
  for select to authenticated using (user_id = auth.uid());
create policy "publier son avis" on public.reviews
  for insert to authenticated with check (user_id = auth.uid() and hidden = false);
create policy "modifier son avis" on public.reviews
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "supprimer son avis" on public.reviews
  for delete to authenticated using (user_id = auth.uid());

-- Un joueur ne peut modifier que la note et le texte (pas le champ "hidden")
revoke update on public.reviews from anon, authenticated;
grant update (rating, body, updated_at) on public.reviews to authenticated;

-- Signaler l'avis de quelqu'un d'autre
create policy "signaler un avis" on public.review_reports
  for insert to authenticated
  with check (reporter = auth.uid() and review_user <> auth.uid());

-- Un avis signalé par 2 joueurs différents est masqué automatiquement
create or replace function public.auto_hide_review() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from review_reports where review_user = new.review_user) >= 2 then
    update reviews set hidden = true where user_id = new.review_user;
  end if;
  return new;
end $$;
create trigger review_reports_hide after insert on public.review_reports
  for each row execute function public.auto_hide_review();

-- Met à jour la date de modification
-- (un avis masqué le reste : les joueurs n'ont pas le droit de modifier "hidden")
create or replace function public.touch_review() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_review();

-- Liste publique des avis visibles, avec le pseudo de l'auteur.
-- Lisible par tout le monde, même sans compte.
create or replace function public.get_reviews()
returns table (user_id uuid, username text, rating smallint, body text, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select r.user_id, p.username, r.rating, r.body, r.created_at, r.updated_at
  from reviews r join profiles p on p.id = r.user_id
  where not r.hidden
  order by r.updated_at desc
  limit 300;
$$;
revoke execute on function public.get_reviews() from public;
grant execute on function public.get_reviews() to anon, authenticated;
