-- Run once in Supabase SQL Editor, after the original content table and bucket policies.
-- Safe to re-run: only JSA-owned policies/triggers below are recreated.
begin;

create or replace function public.jsa_touch_content()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
revoke all on function public.jsa_touch_content() from public, anon, authenticated;
drop trigger if exists jsa_content_updated on public.jsa_content;
create trigger jsa_content_updated before update on public.jsa_content
for each row execute function public.jsa_touch_content();

create table if not exists public.jsa_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (length(name) between 1 and 200),
  phone text not null default '' check (length(phone) <= 100),
  reference text not null default '' check (length(reference) <= 100),
  status text not null default 'new' check (status in ('new','contacted','closed')),
  notes text not null default '' check (length(notes) <= 10000)
);
alter table public.jsa_inquiries enable row level security;
revoke all on public.jsa_inquiries from anon, authenticated;
grant select, insert, update, delete on public.jsa_inquiries to authenticated;
drop policy if exists "JSA Main Admin private inquiries" on public.jsa_inquiries;
create policy "JSA Main Admin private inquiries"
on public.jsa_inquiries for all to authenticated
using ((select auth.uid()) = 'ab917e3a-1d14-42c1-bcc2-2cd20e481900'::uuid)
with check ((select auth.uid()) = 'ab917e3a-1d14-42c1-bcc2-2cd20e481900'::uuid);

-- Public image files only; no SVG, HTML, documents or audio uploads in this bucket.
update storage.buckets set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'jsa-images';
commit;

-- Inspect the resulting rules. Only the designated UUID should have write access.
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname='public' and tablename in ('jsa_content','jsa_inquiries'))
   or (schemaname='storage' and tablename='objects');
