create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text not null default 'Asia/Kolkata',
  city text,
  sex text,
  fitness_interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_len check (
    char_length(display_name) between 2 and 50
  ),
  constraint profiles_sex_allowed check (
    sex is null
    or sex in ('male', 'female', 'other', 'prefer_not_to_say')
  )
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  join_code text not null unique,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_name_len check (char_length(name) between 2 and 60),
  constraint groups_join_code_format check (
    join_code ~ '^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$'
  )
);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id),
  constraint group_members_role_allowed check (role in ('admin', 'member'))
);

create index group_members_user_id_idx on public.group_members (user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger groups_set_updated_at
before update on public.groups
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_name text;
begin
  new_name := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
  if new_name is null then
    new_name := split_part(coalesce(new.email, 'user'), '@', 1);
  end if;

  new_name := left(new_name, 50);
  if char_length(new_name) < 2 then
    new_name := rpad(new_name, 2, '_');
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, new_name);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.generate_join_code()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(
        alphabet,
        1 + (floor(random() * char_length(alphabet)))::int,
        1
      );
    end loop;

    exit when not exists (
      select 1 from public.groups where join_code = code
    );
  end loop;

  return code;
end;
$$;

create function public.create_group(p_name text, p_description text)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  new_group public.groups;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.groups (name, description, join_code, created_by)
  values (p_name, p_description, public.generate_join_code(), auth.uid())
  returning * into new_group;

  insert into public.group_members (group_id, user_id, role)
  values (new_group.id, auth.uid(), 'admin');

  return new_group;
end;
$$;

revoke all on function public.generate_join_code() from public;
revoke all on function public.create_group(text, text) from public;
grant execute on function public.create_group(text, text) to authenticated;
