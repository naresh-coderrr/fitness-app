# Fitness Circle — Full V1 Build Plan

> **Working name:** Fitness Circle. This is an internal project name and is not yet the final public brand name.

48 tasks, 14 phases. Covers the complete original scope.

---

## How to use this file

**Paste this wrapper into your agentic IDE, once per task:**

```
Read CLAUDE.md and TASKS.md first.

Determine the first incomplete task and confirm the requested task ID.
Do task <TASK ID> and nothing else.

When finished:
  1. Report each ACCEPTANCE line as PASS or FAIL, honestly.
  2. Run the technical checks required by the task.
  3. If technical acceptance passes, list exactly what the owner must tap/check
     on a physical device.
  4. Do NOT mark the task [x] yet unless the owner has completed the required
     device verification. If the owner has not verified it, leave the task [ ].
  5. After owner verification is confirmed and all acceptance lines pass, change
     that task's checkbox to [x].
  6. Commit with a conventional-commit message.
  7. Stop. Do not start the next task.
```

Then verify on your phone before moving on. **One task per session** — long sessions
are where agents drift from the rules.

### Task status
- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed and verified
- `[!]` Blocked
- `[-]` Deferred

A task may be marked `[x]` only after **both** the AI's technical acceptance checks
and the owner's required device/app verification have passed. This makes the file a
reliable handoff point when changing AI tools or resuming after a token limit.

---

## Progress tracker

### Phase 0 — Foundation
- [x] **0.1** Expo project, theme, shared components
- [x] **0.2** Supabase client and session handling
- [x] **0.3** Navigation shell and auth gate

### Phase 1 — Core database
- [ ] **1.1** Core schema: profiles, groups, members
- [ ] **1.2** RLS helpers and core policies (**security critical**)
- [ ] **1.3** Activity schema: schedules, activities, check-ins
- [ ] **1.4** Social schema: friendships, blocks

### Phase 2 — Auth and profile
- [ ] **2.1** Register, login, logout, password reset
- [ ] **2.2** Profile view and edit
- [ ] **2.3** Profile photo upload

### Phase 3 — Daily check-in and streak
- [ ] **3.1** Morning check-in
- [ ] **3.2** Evening outcome
- [ ] **3.3** Streak calculation and card
- [ ] **3.4** Home screen v1

### Phase 4 — Personal activities
- [ ] **4.1** Weekly activity schedule
- [ ] **4.2** Manual activity logging
- [ ] **4.3** Activity history and Activity tab

### Phase 5 — Groups
- [ ] **5.1** Create and list groups
- [ ] **5.2** Browse, join, leave
- [ ] **5.3** Group detail and members
- [ ] **5.4** Group admin management

### Phase 6 — Group polls
- [ ] **6.1** Poll schema and today's-poll RPC
- [ ] **6.2** Admin poll setup with custom options
- [ ] **6.3** Voting
- [ ] **6.4** Results and history

### Phase 7 — Friends
- [ ] **7.1** User search
- [ ] **7.2** Friend requests
- [ ] **7.3** Friends list and remove
- [ ] **7.4** Block and unblock

### Phase 8 — Reminders and notifications
- [ ] **8.1** Notification permission and scheduling layer
- [ ] **8.2** Personal schedule reminders
- [ ] **8.3** Group reminders
- [ ] **8.4** Push tokens and social notifications
- [ ] **8.5** Notification preferences

### Phase 9 — Group challenges
- [ ] **9.1** Challenge schema and creation
- [ ] **9.2** Contributions and progress

### Phase 10 — One-to-one chat
- [ ] **10.1** Chat schema and RLS
- [ ] **10.2** Conversation list and thread
- [ ] **10.3** Realtime and read receipts

### Phase 11 — Sharing and reactions
- [ ] **11.1** Share a completed activity
- [ ] **11.2** My Circle feed and reactions

### Phase 12 — Privacy and account
- [ ] **12.1** Privacy controls
- [ ] **12.2** Account deletion and data export

### Phase 13 — Polish and ship
- [ ] **13.1** Home screen final
- [ ] **13.2** Loading, empty, error and offline pass
- [ ] **13.3** TESTING.md and full regression run
- [ ] **13.4** Android APK release
- [ ] **13.5** iOS build (optional)

---

## Decisions already made — do not revisit

1. **Android first.** You develop on Windows, so iOS cannot be built or tested
   locally. All code is cross-platform; iOS is task 13.5 and needs EAS cloud
   builds plus a paid Apple Developer account.
2. **The daily group poll IS a check-in.** Voting in a group poll counts towards
   your streak, exactly like a personal check-in does.
3. **Streak = consecutive days with any of**: a daily check-in, a group poll vote,
   or a logged activity. Any answer counts — including "Rest" and "Didn't
   exercise". Showing up is what is rewarded. Day boundary: 03:00 local time.
4. **No cron, no scheduled jobs.** Today's poll is derived from its schedule when
   the app asks for it, and the row is created on first vote.
5. **Reminders use local device notifications**, not server push. Server push
   (task 8.4) is only for social events the device cannot know about.
6. **Timezone defaults to `Asia/Kolkata`** everywhere. Change the default if wrong.
7. **Default activity types**: Walking, Jogging, Running, Cycling, Gym, Yoga,
   Swimming, Other. Stored as a text enum, extensible later.

---

# Phase 0 — Foundation

## 0.1 — Expo project, theme, shared components

```
GOAL
A React Native + Expo app in TypeScript with file-based routing, a theme system,
and the shared components every later task will use. No backend yet.

BUILD
- Create an Expo app (latest SDK), TypeScript, expo-router.
- Install ONLY the Phase 0 dependencies listed in CLAUDE.md section 2.
- Folder structure:
    app/                    # routes only, nothing else
    src/api/                # supabase calls, one file per domain
    src/components/         # shared UI
    src/hooks/              # react-query hooks
    src/lib/                # supabase client, dates, errors
    src/theme.ts
- src/theme.ts: light palette (one primary accent, neutral greys, success / warning /
  danger, surface, border), a 4pt spacing scale, 5 font sizes, 3 border radii.
  Every colour and dimension in the app must come from here.
- Shared components (used by everything after this):
    <Screen>      safe-area page wrapper with standard padding
    <Button>      variants primary | secondary | ghost; loading and disabled states;
                  double-tap safe
    <Card>        standard surface container
    <StateView>   loading spinner / empty (message + action) / error (message + retry)
    <Avatar>      initials on a deterministic colour from the user id; accepts a
                  photo URL later
    <Chip>        selectable pill, used for activity types and poll options
- .gitignore (node_modules, .env, .expo, ios, android). .env.example with the two
  EXPO_PUBLIC_SUPABASE_* keys, empty.
- git init, first commit.

ACCEPTANCE
- `npx expo start` runs with zero errors and zero warnings.
- `npx tsc --noEmit` passes.
- A scratch screen renders every shared component in all its states.
- grep confirms no hex colour or raw pixel number appears in any app/ file.

DO NOT
Add a UI library, Tailwind/NativeWind, a state manager, or any icon pack beyond
Expo's bundled @expo/vector-icons. Do not touch Supabase yet.
```

## 0.2 — Supabase client and session handling

```
GOAL
Connect to Supabase with a session that survives app restart.

CONTEXT
I have created a Supabase project and will paste the URL and anon key into .env.

BUILD
- src/lib/supabase.ts:
    * import 'react-native-url-polyfill/auto' first
    * storage adapter over expo-secure-store. SecureStore has a ~2048-byte limit
      per key — if the session exceeds it, fall back to AsyncStorage and log a
      warning. Handle this case, do not ignore it.
    * autoRefreshToken: true, persistSession: true, detectSessionInUrl: false
    * read EXPO_PUBLIC_SUPABASE_URL / ..._ANON_KEY and throw a clear, readable
      startup error if either is missing
- AppState listener: supabase.auth.startAutoRefresh() on active,
  stopAutoRefresh() on background.
- src/hooks/useSession.ts: { session, user, loading } driven by onAuthStateChange.
- src/lib/errors.ts: map Supabase/Postgres errors to plain English. Start with
  invalid credentials, already registered, rate limited, network failure,
  RLS violation, unique violation.

ACCEPTANCE
- App boots without crashing.
- Blanking the anon key produces a readable error screen, not a white screen.
- `npx tsc --noEmit` passes.

DO NOT
Write auth screens yet. Never store the service_role key anywhere in this repo.
```

## 0.3 — Navigation shell and auth gate

```
GOAL
The five-tab shell and a redirect gate that never flashes the wrong screen.

BUILD
- app/_layout.tsx: QueryClientProvider + session gate. Hold the splash screen
  until useSession reports loading === false, then route:
    no session  -> app/(auth)/login
    session     -> app/(tabs)
- app/(tabs)/_layout.tsx: bottom tabs in this exact order —
    Home | Activity | Groups | Friends | Profile
  with @expo/vector-icons and labels. Each tab is a placeholder screen showing
  its own name.
- app/(auth)/_layout.tsx: stack for the auth screens (placeholders for now).
- Configure a react-query QueryClient: staleTime 30s, retry 1, refetchOnWindowFocus
  off (it misbehaves on mobile), and a global onError that logs through src/lib/errors.

ACCEPTANCE
- Cold start with no session goes straight to login with no flash of the tabs.
- Cold start with a session goes straight to Home with no flash of login.
- All five tabs render and switch.
- `npx tsc --noEmit` passes.

DO NOT
Add a drawer, nested stacks beyond one level per tab, or a custom tab bar.
```

---

# Phase 1 — Core database

## 1.1 — Core schema: profiles, groups, members

```
GOAL
The foundational tables, as a migration file I can paste into the Supabase SQL editor.

BUILD
Create supabase/migrations/001_core.sql:

  extension pgcrypto

  profiles
    id uuid PK -> auth.users(id) on delete cascade
    display_name text not null, 2..50 chars
    avatar_url text null
    timezone text not null default 'Asia/Kolkata'
    city text null
    sex text null check (sex in ('male','female','other','prefer_not_to_say'))
    fitness_interests text[] not null default '{}'
    created_at, updated_at timestamptz not null default now()

  groups
    id uuid PK default gen_random_uuid()
    name text not null, 2..60 chars
    description text null
    join_code text not null unique         -- 6 chars A-Z0-9, excluding 0 O 1 I
    created_by uuid not null -> profiles(id) on delete restrict
    created_at, updated_at

  group_members
    group_id uuid -> groups(id) on delete cascade
    user_id  uuid -> profiles(id) on delete cascade
    role text not null default 'member' check (role in ('admin','member'))
    joined_at timestamptz not null default now()
    PRIMARY KEY (group_id, user_id)
    index on (user_id)

  Plus:
  - set_updated_at() trigger function, attached to every table with updated_at.
  - handle_new_user(): AFTER INSERT ON auth.users trigger, SECURITY DEFINER,
    set search_path = public. Inserts the profiles row, taking display_name from
    raw_user_meta_data->>'display_name', falling back to the email local part.
  - generate_join_code(): unique 6-char code, retries on collision.
  - create_group(p_name text, p_description text) RPC, SECURITY DEFINER: inserts
    the group AND the creator as role 'admin' in one transaction, returns the group.
    This prevents an admin-less group if the second insert fails.

NOTE: collect sex as an optional profile field with these choices:
male / female / other / prefer not to say.
Do NOT collect date of birth. The sex field is intentionally minimal and is included
to support future privacy-controlled women's health features without implementing
those features in V1. Do not use sex for recommendations, ranking, or social display
in V1 unless explicitly specified by a later task.

ACCEPTANCE
- Applies cleanly on a fresh Supabase project, zero errors.
- Creating a user in the Supabase dashboard auto-creates their profiles row.
- create_group() produces exactly one group and one admin membership row.
- Join codes contain no ambiguous characters across 1000 generated samples.

DO NOT
Create any other tables. Later phases add their own migrations.
```

## 1.2 — RLS helpers and core policies (security critical)

```
GOAL
Lock down the core tables. This is the highest-risk task in the project — the anon
key is public, so RLS is the only thing protecting user data.

BUILD
Create supabase/migrations/002_core_rls.sql.

First the SECURITY DEFINER helpers (see CLAUDE.md section 4 — these exist to
prevent infinite recursion). All: language sql, stable, security definer,
set search_path = public.
  is_group_member(gid uuid) -> boolean
  is_group_admin(gid uuid)  -> boolean
  shares_group_with(uid uuid) -> boolean

Enable RLS on profiles, groups, group_members. Then:

  profiles
    select: id = auth.uid() OR shares_group_with(id)
    update: id = auth.uid()
    insert: none (trigger only)
    delete: none

  groups
    select: authenticated (groups are a public, browsable directory)
    insert: created_by = auth.uid()
    update: is_group_admin(id)
    delete: is_group_admin(id)

  group_members
    select: is_group_member(group_id)
    insert: user_id = auth.uid()                      -- you join yourself
    update: is_group_admin(group_id)                  -- role changes
    delete: user_id = auth.uid() OR is_group_admin(group_id)

ACCEPTANCE — you must actually RUN these, not just write the policies
Create users A, B (both in group G, A is admin) and C (in no group). Verify:
  1. C selects group_members of G                   -> 0 rows
  2. C selects A's profile                          -> 0 rows
  3. B (member) updates G's name                    -> 0 rows affected
  4. B deletes A from group_members                 -> 0 rows affected
  5. B deletes their own membership (leaves)        -> succeeds
  6. A (admin) updates G's name                     -> succeeds
  7. C selects the list of all groups               -> succeeds (public directory)
  8. A inserts a group_members row for C            -> 0 rows affected
Report the real result of all 8.

DO NOT
Use `using (true)` anywhere except the groups select policy. Never write a policy
containing a subquery against the table it protects.
```

## 1.3 — Activity schema: schedules, activities, check-ins

```
GOAL
The tables behind the personal fitness loop, with RLS.

BUILD
Create supabase/migrations/003_activities.sql.

  activity_type: a text domain or check constraint over
    ('walking','jogging','running','cycling','gym','yoga','swimming','other')

  scheduled_activities              -- a recurring WEEKLY TEMPLATE, not instances
    id uuid PK
    user_id uuid -> profiles(id) on delete cascade
    activity_type text not null (activity_type check)
    day_of_week smallint not null check (0..6)     -- 0 = Sunday
    start_time time not null
    duration_minutes int null check (> 0)
    is_active boolean not null default true
    created_at, updated_at
    index on (user_id, day_of_week)

  activities                        -- an actual logged session
    id uuid PK
    user_id uuid -> profiles(id) on delete cascade
    activity_type text not null (activity_type check)
    activity_date date not null
    start_time time null
    end_time time null
    duration_minutes int null check (> 0)
    distance_km numeric(6,2) null check (>= 0)     -- optional, not all types have it
    notes text null
    visibility text not null default 'private'
       check (visibility in ('private','friends','groups'))
    created_at, updated_at
    index on (user_id, activity_date desc)

  daily_checkins
    user_id uuid -> profiles(id) on delete cascade
    checkin_date date not null
    planned_type text null (activity_type check, or 'rest')
    outcome text null check (outcome in ('completed','partial','missed','rest'))
    planned_at, outcome_at timestamptz null
    created_at, updated_at
    PRIMARY KEY (user_id, checkin_date)            -- one per user per day

RLS: all three tables — select/insert/update/delete all gated on
user_id = auth.uid(). Friends' and groups' visibility of `activities` is added in
Phase 11, not now.

IMPORTANT — no instance materialisation. scheduled_activities is a weekly template.
Do NOT generate a row per occurrence. "Today's plan" is derived by matching
day_of_week. Completion is recorded on daily_checkins or activities for that date,
never on the template.

ACCEPTANCE
- Applies cleanly.
- A second daily_checkins row for the same user and date is rejected by the PK.
- A negative distance and a zero duration are both rejected.
- User A cannot select, update or delete user B's activities. Verify with two users.

DO NOT
Create a streaks table — streaks are computed. Do not create activity instances.
```

## 1.4 — Social schema: friendships, blocks

```
GOAL
Friend relationships in a single table that cannot get out of sync.

BUILD
Create supabase/migrations/004_social.sql.

  friendships                       -- ONE table, not friendships + friend_requests
    id uuid PK
    requester_id uuid -> profiles(id) on delete cascade
    addressee_id uuid -> profiles(id) on delete cascade
    status text not null default 'pending'
      check (status in ('pending','accepted','rejected'))
    created_at, updated_at
    check (requester_id <> addressee_id)
    UNIQUE index on (least(requester_id,addressee_id), greatest(requester_id,addressee_id))
       -- normalised pair: prevents A->B and B->A existing at the same time
    index on (addressee_id, status)
    index on (requester_id, status)

  blocked_users                     -- separate: you can block a non-friend
    blocker_id uuid -> profiles(id) on delete cascade
    blocked_id uuid -> profiles(id) on delete cascade
    created_at
    PRIMARY KEY (blocker_id, blocked_id)
    check (blocker_id <> blocked_id)

  Helpers (SECURITY DEFINER, stable):
    are_friends(uid uuid) -> boolean      -- accepted friendship with auth.uid()
    is_blocked_either_way(uid uuid) -> boolean

RLS:
  friendships
    select: requester_id = auth.uid() OR addressee_id = auth.uid()
    insert: requester_id = auth.uid() AND NOT is_blocked_either_way(addressee_id)
    update: addressee_id = auth.uid()        -- only the recipient accepts/rejects
    delete: either party                     -- unfriend, or cancel your own request
  blocked_users
    select/insert/delete: blocker_id = auth.uid()
    update: none

Also add block_user(uid) RPC, SECURITY DEFINER: inserts the block AND deletes any
friendship row between the two, in one transaction.

ACCEPTANCE
  1. A requests B, then B requests A          -> second insert violates the unique index
  2. C tries to accept A and B's request      -> 0 rows affected
  3. A blocks B, then B requests A            -> insert rejected
  4. block_user removes an existing friendship -> verify the row is gone
  5. A cannot select a friendship between B and C -> 0 rows
  6. Either party can delete an accepted friendship -> succeeds

DO NOT
Create a separate friend_requests table. Do not make blocking symmetric.
```

---

# Phase 2 — Auth and profile

## 2.1 — Register, login, logout, password reset

```
GOAL
Full auth working end to end against Supabase.

BUILD
- app/(auth)/login.tsx, register.tsx, forgot-password.tsx, reset-password.tsx
- Register: display name, email, password. Pass display_name in options.data so
  the profile trigger picks it up.
- Client validation before submit: valid email, password >= 8 chars, display name
  2..50. Errors appear under the field, never in an alert.
- All Supabase errors pass through src/lib/errors.ts. Never show a raw message.
- Submit buttons: spinner, disabled while in flight, double-tap safe.
- Password reset: deep link back into the app (configure the scheme in app.json
  and the redirect URL in Supabase Auth settings), then a reset-password screen.
- Logout lives on Profile: confirm dialog, then clear the react-query cache.

ACCEPTANCE
Run each and report:
  1. Register new user            -> lands on Home; profiles row has the right name
  2. Register the same email      -> friendly "already registered" message
  3. Login wrong password         -> friendly message, password field cleared
  4. Login correct                -> Home
  5. Kill and reopen the app      -> still logged in
  6. Forgot password              -> email arrives, link opens the app, reset works
  7. Airplane mode                -> "check your connection", no crash
  8. Logout                       -> back to login; back gesture cannot re-enter

DO NOT
Add OAuth, social login, phone auth, or email-verification gating.
```

## 2.2 — Profile view and edit

```
GOAL
The Profile tab: your details, your stats, your groups, logout.

BUILD
- src/api/profile.ts + hooks: getProfile, updateProfile.
- Profile screen, in order:
    <Avatar> (initials for now) + display name
    current streak (placeholder until 3.3)
    city, fitness interests
    "My groups" list (placeholder until Phase 5)
    recent activities (placeholder until Phase 4)
    Edit profile / Settings / Log out
- Edit screen: display name, city, sex, timezone, fitness interests (multi-select
  chips from a fixed list: Walking, Running, Cycling, Gym, Yoga, Swimming, Other).
  Sex choices: Male, Female, Other, Prefer not to say. Store the value in a normalized
  form and do not expose it publicly in V1.
  Timezone picker: the device-detected zone plus a short list of common zones.
- Optimistic update with rollback on failure.

ACCEPTANCE
- Changes persist across app restart.
- Sex can be set to Male, Female, Other, or Prefer not to say and persists correctly.
- Sex is not shown on public/friend/group profile views in V1.
- Renders correctly for a brand-new user with no groups and no activities.
- Timezone change is reflected in date calculations elsewhere.
- Cancelling the edit screen discards changes.

DO NOT
Add date of birth. Do not display sex on public/friend/group profiles in V1.
Do not add women's health or period tracking yet; those are future, privacy-controlled
features.
```

## 2.3 — Profile photo upload

```
GOAL
Let users set a profile photo, stored in Supabase Storage.

BUILD
- Create a Storage bucket `avatars`, public read. RLS policies: a user may insert,
  update and delete only under the path prefix `{auth.uid()}/`.
- Install expo-image-picker and expo-image-manipulator.
- Flow: tap avatar -> choose Camera or Library -> request permission with a clear
  rationale -> crop to square -> resize to 512x512 and compress to JPEG (target
  under 200KB) -> upload to `{user_id}/avatar.jpg` with upsert -> save the public
  URL to profiles.avatar_url.
- <Avatar> shows the photo when avatar_url is set, initials when not, and falls
  back to initials if the image fails to load.
- Allow removing the photo (delete the object, null the column).

ACCEPTANCE
- Upload from camera and from library both work.
- Denying the permission shows an explanation and does not crash.
- A 5MB source photo ends up under 200KB in the bucket.
- User A cannot upload to user B's path. Verify this directly against Storage.
- Removing the photo reverts to initials everywhere in the app.

DO NOT
Add photo filters, multiple photos, or a cover image.
```

---

# Phase 3 — Daily check-in and streak

## 3.1 — Morning check-in

```
GOAL
The single most important interaction: declare today's plan in under 3 seconds.

BUILD
- src/api/checkins.ts + hooks: getTodayCheckin, setPlan, setOutcome.
  "Today" is computed in the user's timezone with a 03:00 rollover — put that in
  src/lib/dates.ts as todayFor(profile) and use it EVERYWHERE. Never call new Date().
- Morning card on Home:
      Good morning, {first name}
      What's your plan today?
      [ Walk ] [ Gym ] [ Run ] [ Cycle ] [ Yoga ] [ Rest ]
  Large chips, two columns, one tap to select. Upserts daily_checkins.planned_type
  and planned_at.
- After selection the card collapses to "Today: Gym" with a small Change link.
- If a scheduled_activity exists for today, pre-highlight that type (Phase 4).

ACCEPTANCE
- Tapping a plan saves instantly and survives an app restart.
- Changing the plan updates the same row — never creates a second one.
- At 02:00 local the card still shows the previous day (03:00 boundary).
- Offline tap shows the selection, then rolls back with "Couldn't save, retry".

DO NOT
Add notes, a time picker, or multi-select. Speed is the whole point.
```

## 3.2 — Evening outcome

```
GOAL
Close the loop: how did today actually go?

BUILD
- Evening card, shown on Home after 17:00 local (or any time if the plan is set
  and the outcome is not):
      How did you do today?
      [ Completed ] [ Partially ] [ Didn't exercise ]
  Plus a "Rest day" option if no plan was set.
- Writes daily_checkins.outcome and outcome_at.
- On "Completed" or "Partially", offer one optional follow-up: "Log the details?"
  which deep-links to the activity log form (Phase 4). Skipping is one tap and
  must feel completely fine.
- Once the outcome is set the card shows a friendly confirmation plus the streak.

ACCEPTANCE
- Outcome saves and persists.
- Setting an outcome with no plan works (user opened the app only in the evening).
- Changing the outcome updates the same row.
- The card does not appear at all once the outcome is recorded.
- Tone check: "Didn't exercise" produces an encouraging response, never a negative one.

DO NOT
Require the activity log. Never guilt the user.
```

## 3.3 — Streak calculation and card

```
GOAL
The number that brings people back tomorrow.

BUILD
Create supabase/migrations/005_streak.sql:

  get_user_streak(p_user_id uuid default auth.uid()) returns int
    SECURITY DEFINER, stable, set search_path = public.
    A day counts if, for that date, the user has ANY of:
      - a daily_checkins row with a non-null planned_type or outcome
      - a poll vote (Phase 6 — write the query so it tolerates the table not
        existing yet, or add this branch in 6.3)
      - a logged activities row
    Count consecutive days backwards from today. If today has nothing yet, start
    from yesterday — today must not break the streak before it is over.
    Day boundary: 03:00 in the user's profiles.timezone.

  get_streak_calendar(p_user_id uuid, p_days int default 30) returns json
    One entry per date: { date, active boolean }. For the Profile screen.

App:
- src/hooks/useStreak.ts.
- Streak card: flame, "8 Days", and one encouraging line that varies by band
  (0 / 1-2 / 3-6 / 7-29 / 30+).
- Zero state: "Start your streak — check in today." NEVER "You lost your streak."
- If today is not yet recorded: "Check in today to keep your streak going."
- 30-day dot calendar on the Profile screen.

ACCEPTANCE
  1. Insert check-ins for 5 consecutive past days -> returns 5
  2. Delete the middle one                        -> returns 2
  3. Today empty, yesterday present               -> yesterday's streak, not 0
  4. A check-in at 02:00 counts for the previous day
  5. A "Rest" outcome keeps the streak alive
  6. A "Didn't exercise" outcome keeps the streak alive (showing up counts)
  7. A user with a check-in AND an activity on one day counts that as 1 day

DO NOT
Create a streaks table. No badges, levels, trophies or leaderboards.
```

## 3.4 — Home screen v1

```
GOAL
A Home screen that is genuinely useful with zero friends and zero groups. Most of
your users will see this state first.

BUILD
Sections, in this order — most actionable at the top:
  1. Greeting: "Good morning / afternoon / evening, {first name}" by local time
  2. Morning check-in card (3.1) or evening outcome card (3.2), whichever applies
  3. Streak card (3.3)
  4. Today's scheduled activity, if any (placeholder until Phase 4)
Placeholders, clearly marked as TODO, for: My Circle (Phase 11), Group challenge
(Phase 9), Today's poll (Phase 6), Upcoming reminders (Phase 8).

Pull to refresh refetches everything. Refetch on app foreground.

ACCEPTANCE
- A brand-new user sees exactly one obvious next action.
- Once the outcome is recorded: "You're done for today. See you tomorrow." plus streak.
- Loads in under 1 second on a normal connection.
- No horizontal scroll; no clipped text at the largest OS font size.

DO NOT
Add anything not listed. The screen must stay scannable in 5 seconds.
```

---

# Phase 4 — Personal activities

## 4.1 — Weekly activity schedule

```
GOAL
"Monday — Gym — 6:00 AM" as a recurring weekly plan.

BUILD
- Install @react-native-community/datetimepicker.
- src/api/schedules.ts + hooks: list, create, update, delete, toggleActive.
- Schedule screen (inside the Activity tab): the week as 7 sections, each listing
  that day's planned activities sorted by time.
- Add/edit form: activity type chips, day-of-week toggles (one entry can be
  created for several days at once), start time, optional duration.
- Delete with confirm. Toggle active without deleting.
- Home shows today's scheduled items and pre-highlights the type in the morning
  check-in card.

ACCEPTANCE
- Creating an entry for Mon/Wed/Fri produces 3 rows.
- The Home pre-highlight matches today's schedule.
- Empty state: "No schedule yet — add your first activity."
- Editing time and type persists; toggling inactive hides it from Home but keeps the row.
- A day with three entries renders them in time order.

DO NOT
Generate one row per occurrence. This is a weekly template — see task 1.3.
No calendar view, no recurrence rules beyond day-of-week.
```

## 4.2 — Manual activity logging

```
GOAL
Record what actually happened. Manual only.

BUILD
- src/api/activities.ts + hooks: list, create, update, delete.
- Log form:
      activity type   chips, required
      date            defaults to today, cannot be in the future
      start / end     optional; if both are set, compute duration automatically
      duration        minutes, required if start/end are not given
      distance        km, OPTIONAL — hide this field for gym and yoga
      notes           optional, max 500 chars
- Saving an activity auto-sets today's daily_checkins.outcome to 'completed' if
  the outcome is not already set. The user must never enter the same thing twice.
- Quick-log path: from the evening outcome card, prefilled with the planned type.
- Edit and delete existing entries, delete with confirm.

ACCEPTANCE
  1. Log 30 minutes of walking with 2.8 km          -> saved and listed
  2. Log a gym session                              -> no distance field shown
  3. Start 06:00, end 06:45                         -> duration auto-fills to 45
  4. A future date                                  -> blocked with a clear message
  5. Zero or negative duration                      -> blocked
  6. Logging an activity                            -> today's check-in shows completed
  7. Edit then delete                               -> both work, list updates

DO NOT
Add GPS, a live timer, route maps, calories, heart rate, or photos.
```

## 4.3 — Activity history and Activity tab

```
GOAL
"What have I actually been doing?" — the payoff for logging.

BUILD
- Activity tab, two segments: Schedule (4.1) and History.
- History: activities grouped by month, newest first, each row showing type icon,
  date, duration, distance if present, and a notes indicator. Paginate 20 at a
  time with infinite scroll.
- A simple summary header for the current month: total sessions, total minutes,
  total distance, and the most frequent activity type. Plain numbers in a row —
  no charts, no chart library.
- Filter by activity type.
- Tap a row to view, edit or delete.

ACCEPTANCE
- 100 logged activities scroll smoothly and paginate correctly.
- Empty state: "No activities yet — log your first one."
- Monthly totals are arithmetically correct; verify against the raw rows.
- The filter persists while the tab is focused and resets on app restart.

DO NOT
Add charts, graphs, a charting library, or export.
```

---

# Phase 5 — Groups

## 5.1 — Create and list groups

```
GOAL
The Groups tab: my groups, and creating one.

BUILD
- src/api/groups.ts + hooks: listMyGroups, createGroup (via the create_group RPC
  from 1.1), getGroup.
- Groups tab: my groups as cards — name, member count, my role badge, and today's
  participation once polls exist.
- Empty state: "You're not in a group yet" with two buttons — Create a group,
  Join a group.
- Create screen: name (required), description (optional). On success go straight
  to the group detail screen with the join code shown prominently and copyable.

ACCEPTANCE
- Creating a group makes me its admin — verify the group_members row.
- The join code is 6 unique characters with no ambiguous ones.
- The empty state appears for a new user and both buttons work.
- Pull to refresh works; the list updates after creating a group.

DO NOT
Add group avatars, categories, or privacy settings.
```

## 5.2 — Browse, join, leave

```
GOAL
Find and join any group; leave cleanly.

BUILD
- src/api/groups.ts: searchGroups(q), joinByCode(code), joinGroup(id), leaveGroup(id).
- Browse screen: search by name, showing name, description, member count and
  whether I am already a member. Debounce input 300ms.
- Join by code: 6-char input, auto-uppercase, clear error for an unknown code.
- Leave: confirm dialog. Block the last admin from leaving unless they are also
  the last member — "Make someone else an admin first." Enforce this in a
  leave_group RPC server-side, not only in the UI.

ACCEPTANCE
  1. Join by valid code                          -> appears in My Groups
  2. Join by invalid code                        -> "That code doesn't match any group"
  3. Join a group I'm already in                 -> handled gracefully, no duplicate
  4. Leave                                       -> disappears from My Groups
  5. Sole admin with other members leaves        -> blocked, with the reason
  6. Sole admin who is the only member leaves    -> allowed
  7. Search with no results                      -> clear empty state

DO NOT
Add join requests or approval flows. Anyone can join any group in V1.
```

## 5.3 — Group detail and members

```
GOAL
The group's home screen.

BUILD
Sections in this order:
  1. Group name, description, member count
  2. Today's poll card (placeholder until Phase 6)
  3. Active challenge (placeholder until Phase 9)
  4. Upcoming reminders (placeholder until Phase 8)
  5. Members — avatar, name, admin badge, activity dot for today
  6. Join code with a copy button (members only)
  7. Leave group
Admins also see an "Manage group" entry point (task 5.4).
A non-member who deep-links here sees "You're not a member of this group" with a
Join button — never a crash and never leaked data.

ACCEPTANCE
- Non-members see the join prompt, and no member list.
- Non-admins see no admin controls anywhere on the screen.
- Renders correctly for a 1-member group and a 30-member group.
- Copying the join code works and confirms with a toast.

DO NOT
Add group chat or announcements. Member rows show name and badge only.
```

## 5.4 — Group admin management

```
GOAL
Everything an admin needs, in one place.

BUILD
- Admin-only "Manage group" screen:
    Edit name and description
    Members: promote to admin, demote to member, remove (with confirm)
    Invite: share the join code via the OS share sheet
    Delete group (with a typed confirmation of the group name)
- Rules, enforced server-side in RPCs, not just the UI:
    cannot remove yourself
    cannot remove another admin (demote first)
    cannot demote the last admin
    deleting a group cascades its members, polls, challenges and reminders

ACCEPTANCE
  1. Promote a member                     -> they gain admin controls on next load
  2. Demote the last admin                -> blocked with a clear reason
  3. Remove a member                      -> list updates; they lose access
  4. A removed member opens the group     -> sees the non-member view
  5. Delete a group                       -> gone for all members, no orphan rows
  6. A non-admin calls the RPCs directly  -> rejected by RLS

DO NOT
Add group settings, roles beyond admin/member, or transfer-ownership flows.
```

---

# Phase 6 — Group polls

## 6.1 — Poll schema and today's-poll RPC

```
GOAL
The scheduled daily poll, with no cron and no Edge Functions.

BUILD
Create supabase/migrations/006_polls.sql:

  poll_templates                      -- the recurring daily poll
    id uuid PK
    group_id uuid -> groups(id) on delete cascade
    question text not null
    schedule_time time not null default '06:00'
    close_after_hours int not null default 18 check (between 1 and 24)
    days_of_week smallint[] not null default '{0,1,2,3,4,5,6}'
    timezone text not null default 'Asia/Kolkata'
    is_active boolean not null default true
    created_by uuid -> profiles(id)
    created_at, updated_at
    partial unique index on (group_id) where is_active   -- one active poll per group

  poll_options
    id uuid PK
    template_id uuid -> poll_templates(id) on delete cascade
    label text not null, 1..40 chars    -- e.g. '30 mins', '40 mins', 'Rest'
    sort_order int not null default 0
    is_active boolean not null default true   -- SOFT delete only
    created_at

  poll_instances                      -- one per template per date
    id uuid PK
    template_id uuid -> poll_templates(id) on delete cascade
    group_id uuid -> groups(id) on delete cascade
    poll_date date not null
    opens_at, closes_at timestamptz not null
    created_at
    UNIQUE (template_id, poll_date)
    index on (group_id, poll_date desc)

  poll_votes
    instance_id uuid -> poll_instances(id) on delete cascade
    user_id uuid -> profiles(id) on delete cascade
    option_id uuid -> poll_options(id) on delete restrict
    created_at, updated_at
    PRIMARY KEY (instance_id, user_id)        -- one vote per user per day
    index on (user_id, created_at desc)

RLS:
  templates / options: select is_group_member; write is_group_admin
  instances: select and insert is_group_member; no update or delete
  votes: select is_group_member of the instance's group
         insert user_id = auth.uid() AND member AND now() between opens_at and closes_at
         update/delete user_id = auth.uid() AND now() < closes_at

RPCs:
  get_or_create_today_poll(p_group_id uuid) returns json
    1. exception unless is_group_member
    2. load the active template; null if none
    3. today's date in the TEMPLATE's timezone
    4. null if today's weekday is not in days_of_week
    5. opens_at = today at schedule_time; closes_at = opens_at + close_after_hours
    6. if now() < opens_at: status 'upcoming', no instance created
    7. else INSERT ... ON CONFLICT (template_id, poll_date) DO NOTHING, then select
    8. return instance, question, active options in sort_order, per-option counts,
       total votes, this user's option_id, and status upcoming|open|closed

  get_poll_results(p_instance_id uuid) returns json
    members only; per option: label, count, percentage, voter display_names

Finally, extend get_user_streak from 3.3 to also count a day when the user has a
poll vote whose instance poll_date is that day.

ACCEPTANCE
  1. Two concurrent calls in the same second -> exactly ONE poll_instances row
  2. A non-member calling it                 -> exception, not data
  3. Before schedule_time                    -> 'upcoming', no row created
  4. A second active template for a group    -> rejected by the partial unique index
  5. Voting twice                            -> PK violation
  6. Voting after closes_at                  -> policy violation
  7. A poll vote extends the streak

DO NOT
Use pg_cron, Edge Functions, or any scheduled job for this.
```

## 6.2 — Admin poll setup with custom options

```
GOAL
The admin defines the group's daily question and its own answer options.

BUILD
- Admin-only "Manage poll" screen:
    Question    text, default "Did you exercise today?"
    Options     dynamic list: add, edit, reorder, remove. 2..8 options.
                Default set: "30 mins", "40 mins", "1 hour", "Rest"
    Opens at    time picker, default 06:00
    Open for    hours, default 18
    Days        weekday toggles, default all 7
    Active      on/off
- Removing an option that already has votes must SOFT delete (is_active = false).
  Never hard delete — historical results must still render. Warn the admin:
  "This option has 12 votes. It will be hidden from new polls but kept in history."
- Editing the schedule must not alter poll_instances that already exist.

ACCEPTANCE
  1. Create with 4 custom options       -> members see exactly those options
  2. Reorder                            -> new order shows on the vote screen
  3. Soft-delete a voted option         -> gone from today's ballot, kept in history
  4. Fewer than 2 options               -> cannot save, clear message
  5. Deactivate                         -> members see "No poll scheduled"
  6. Change opens-at after an instance exists -> today's instance is unchanged

DO NOT
Add multiple concurrent polls, one-off polls, multi-select voting, or anonymous voting.
```

## 6.3 — Voting

```
GOAL
A 3-second interaction that feels instant. This is the app's most-used action.

BUILD
- A <TodayPollCard> component used on both the group screen and Home.
- States:
    upcoming   "Today's poll opens at 6:00 AM"
    open       question + large option buttons
    voted      your choice ticked, a Change link, live results
    closed     results only, read-only
    none       "No poll scheduled" (+ "Set one up" for admins)
- Vote via upsert on (instance_id, user_id) so change-of-mind is one code path.
- Optimistic UI: the tick appears immediately, rolls back with a toast on failure.
- Call get_or_create_today_poll on screen focus, not on every render.

ACCEPTANCE
  1. Vote                          -> ticks immediately, counts update
  2. Change vote                   -> old count down, new up, still one vote
  3. Airplane mode                 -> tick then rollback with "Couldn't save, retry"
  4. Two devices, same user        -> refresh shows one consistent answer
  5. Vote after close              -> "This poll has closed"
  6. Open before opens_at          -> 'upcoming', no instance row created
  7. Voting extends today's streak

DO NOT
Add comments or reactions on polls.
```

## 6.4 — Results and history

```
GOAL
Make showing up visible. This is the social pressure that drives the loop.

BUILD
- Results under the poll: each option as a horizontal bar with label, count and
  percentage, sorted by count descending.
- Summary line: "12 of 20 members voted".
- Tap an option to see who chose it. Voting is not anonymous — that is the point.
- Group poll history: last 14 days, one compact row per day with the date, the
  winning option, and the turnout.

ACCEPTANCE
- Percentages sum to 100 — handle rounding so they never display 99%.
- Zero votes -> "No one has voted yet. Be first." not a division by zero.
- History renders for a group that is one day old.
- Bars are readable for both a 2-member and a 30-member group.

DO NOT
Add charts, a charting library, or export.
```

---

# Phase 7 — Friends

## 7.1 — User search

```
GOAL
Find people to add.

BUILD
- A search_users(q text) RPC, SECURITY DEFINER: case-insensitive prefix match on
  display_name, minimum 2 characters, limit 20. Returns id, display_name,
  avatar_url and the relationship status with the caller
  (none | pending_sent | pending_received | friends | blocked).
  It must EXCLUDE users who have blocked the caller and users the caller has blocked.
  Never return email addresses.
- Search screen inside the Friends tab. Debounce 300ms. Each row has a context
  action: Add / Pending / Accept / Friends / (blocked rows are not shown at all).

ACCEPTANCE
  1. Search by partial name                  -> matching users appear
  2. Search under 2 characters               -> prompts for more, does not query
  3. A blocked user                          -> never appears in results
  4. A user who blocked me                   -> never appears in results
  5. No email address is present in the payload — inspect the network response
  6. No results                              -> clear empty state

DO NOT
Add search by email or phone, contact-list import, or user suggestions.
```

## 7.2 — Friend requests

```
GOAL
Send, accept and reject requests.

BUILD
- src/api/friends.ts + hooks: sendRequest, acceptRequest, rejectRequest,
  cancelRequest, listIncoming, listOutgoing.
- Friends tab, three segments: Friends | Requests | Find.
- Requests segment: incoming with Accept/Reject, outgoing with Cancel. Show a
  badge count on the tab for incoming pending requests.
- Sending to someone who has already sent you a request should ACCEPT theirs
  rather than creating a duplicate. Handle this in the API layer.

ACCEPTANCE
  1. A sends to B         -> B sees it in Requests with a tab badge
  2. B accepts            -> both appear in each other's Friends list
  3. B rejects            -> gone from B's list; A sees no error
  4. A cancels a pending  -> row deleted; B no longer sees it
  5. A sends to B while B's request to A is pending -> becomes accepted, one row only
  6. A sends twice        -> blocked by the unique index, friendly message
  7. C tries to accept a request between A and B   -> rejected by RLS

DO NOT
Add request messages, mutual-friend counts, or friend suggestions.
```

## 7.3 — Friends list and remove

```
GOAL
See your friends and what they are up to.

BUILD
- Friends segment: avatar, name, current streak, today's activity if their privacy
  settings allow it (default: friends can see activity type and completion, nothing
  more). Sort by: active today first, then alphabetical.
- Tap a friend -> a read-only friend profile: avatar, name, city, fitness interests,
  streak, recent shared activities, shared groups. Actions: Message (Phase 10),
  Remove friend, Block.
- Remove friend: confirm dialog, deletes the friendship row.

ACCEPTANCE
- Empty state: "No friends yet — find people to keep you accountable."
- A friend profile never shows an email address or private activities.
- Removing a friend removes it from both sides immediately.
- The list renders correctly with 1 friend and with 50.

DO NOT
Add a mutual-friends list, a follower model, or activity notifications here.
```

## 7.4 — Block and unblock

```
GOAL
A user can remove someone from their experience entirely.

BUILD
- Block from the friend profile and from a chat thread. Confirm dialog explaining
  the effect: "They won't be able to find you, message you, or see your activity."
- Use the block_user RPC from 1.4 — it removes any friendship in the same transaction.
- A blocked user must be invisible in: search, friends list, the circle feed,
  chat, and group member lists must still show them (they share a group) but with
  no interaction actions.
- Settings > Blocked users: list and unblock.

ACCEPTANCE
  1. Block                    -> friendship removed, they vanish from search
  2. Blocked user searches me -> I do not appear
  3. Blocked user sends me a friend request -> rejected by RLS
  4. Blocked user opens our old chat -> cannot send; sees a neutral notice
  5. Unblock                  -> they reappear in search; friendship is NOT restored
  6. Same group               -> still listed as a member, with no actions

DO NOT
Notify the blocked user. Do not add reporting or moderation flows.
```

---

# Phase 8 — Reminders and notifications

## 8.1 — Notification permission and scheduling layer

```
GOAL
The plumbing every reminder will use.

BUILD
- Install expo-notifications and expo-device.
- src/lib/notifications.ts:
    requestPermission()      with a clear in-app rationale screen shown BEFORE the
                             OS prompt, so a denial is not permanent
    scheduleLocal(id, title, body, trigger)
    cancelLocal(id)
    cancelAllForType(prefix)
    rescheduleAll()          rebuilds every local notification from the DB
- Android: create a notification channel. Android 13+ requires runtime
  POST_NOTIFICATIONS permission — handle a denial gracefully and show a banner
  offering to open system settings.
- Note in a comment: Android may delay non-exact alarms by a few minutes. Do not
  design around exact firing.
- Call rescheduleAll() on login, on app foreground, and after any schedule change.

ACCEPTANCE
- Permission rationale appears before the OS prompt.
- Denying permission does not crash; an in-app banner explains what is lost.
- A test notification fires while the app is backgrounded.
- Reinstalling and logging in rebuilds all scheduled notifications.

DO NOT
Set up server push here — that is task 8.4.
```

## 8.2 — Personal schedule reminders

```
GOAL
"Your 30-minute walk is scheduled for 6:30 AM."

BUILD
- For each active scheduled_activity, schedule a weekly repeating local
  notification at (start_time - lead minutes), lead defaulting to 15 and
  configurable in notification preferences.
- Evening nudge: if the user has an active schedule today and no check-in by
  20:00 local, a single local notification — "How did today go?" — that deep-links
  to the evening check-in card.
- Streak nudge: at 20:30 local, only if the streak is 3 or more AND today has no
  check-in — "You're on a 9-day streak. Check in to keep it going."
- All of these respect the preferences from 8.5 and the quiet hours window.

ACCEPTANCE
- Creating a Monday 06:00 schedule produces a notification at Monday 05:45.
- Deleting or deactivating the schedule cancels it.
- Checking in before 20:00 suppresses the evening nudge.
- A streak of 2 produces no streak nudge; a streak of 3 does.
- Changing timezone reschedules everything to the new local times.

DO NOT
Send more than 3 notifications per day to one user, ever.
```

## 8.3 — Group reminders

```
GOAL
"Morning Walk — 6:30 AM", set by a group admin for the whole group.

BUILD
Create supabase/migrations/007_reminders.sql:

  group_reminders
    id uuid PK
    group_id uuid -> groups(id) on delete cascade
    title text not null, 1..80 chars
    description text null
    remind_at timestamptz null           -- one-off
    recurring_days smallint[] null       -- OR weekly recurrence
    recurring_time time null
    timezone text not null
    is_active boolean not null default true
    created_by uuid -> profiles(id)
    created_at, updated_at
    check (remind_at is not null OR (recurring_days is not null AND recurring_time is not null))
  RLS: select is_group_member; write is_group_admin.

App:
- Admin creates, edits and deletes reminders from Manage group.
- Every member's device schedules a local notification for each active reminder
  of every group they belong to. Cancel on leaving the group or on deletion.
- Upcoming reminders (next 7 days) appear on the group screen and on Home.

ACCEPTANCE
  1. Admin creates "Sunday Cycling, Sunday 06:00" -> all members get it Sunday 05:45
  2. Non-admin tries to create one                -> rejected by RLS
  3. A member leaves the group                    -> their local notification is cancelled
  4. Admin deletes the reminder                   -> cancelled on all devices on next foreground
  5. Members in different timezones               -> each fires at the reminder's stated local time
  6. Home shows the next upcoming reminder across all groups

DO NOT
Add RSVPs, attendance tracking, or reminder comments.
```

## 8.4 — Push tokens and social notifications

```
GOAL
Notify users about things their own device cannot know: a friend finished a
workout, a challenge hit a milestone, a friend request arrived.

BUILD
Create supabase/migrations/008_push.sql:
  push_tokens (user_id, token text, platform text, created_at,
               PRIMARY KEY (user_id, token))
  RLS: user_id = auth.uid() for all operations.

- Register the Expo push token on login; remove it on logout.
- One Supabase Edge Function `notify`, invoked from the app after the triggering
  action (not from a database trigger — keep it simple and debuggable). It:
    looks up the recipients' tokens and notification_preferences,
    filters by preference and quiet hours,
    batches to the Expo Push API,
    deletes tokens the Expo API reports as DeviceNotRegistered.
- Events: friend request received, friend request accepted, a friend shared an
  activity, a challenge crossed 50% / 75% / 100%, a new message (Phase 10).
- The Expo access token lives in Edge Function secrets. Never in the app.

IMPORTANT: remote push does not work in Expo Go on Android. Test this with an
EAS development build, not Expo Go.

ACCEPTANCE
- A token is registered on login and deleted on logout.
- A friend request produces a push on a second physical device.
- A user who has disabled that preference receives nothing.
- Quiet hours suppress delivery.
- An uninstalled device's stale token is cleaned up after one failed send.
- grep confirms no Expo access token or service_role key in the app bundle.

DO NOT
Add database triggers that call HTTP. Do not build an in-app notification inbox.
```

## 8.5 — Notification preferences

```
GOAL
Users control what reaches them. Notifications must be useful, never annoying.

BUILD
Add to migration 008:
  notification_preferences
    user_id uuid PK -> profiles(id) on delete cascade
    schedule_reminders  boolean not null default true
    reminder_lead_minutes int not null default 15
    group_reminders     boolean not null default true
    evening_checkin     boolean not null default true
    streak_nudge        boolean not null default true
    friend_activity     boolean not null default true
    friend_requests     boolean not null default true
    challenge_updates   boolean not null default true
    messages            boolean not null default true
    quiet_hours_start   time not null default '22:00'
    quiet_hours_end     time not null default '07:00'
    created_at, updated_at
  RLS: user_id = auth.uid(). Create the row in handle_new_user().

- Settings > Notifications screen with a toggle per preference, the lead-time
  picker, and quiet hours.
- Changing any preference immediately calls rescheduleAll().
- If OS permission is denied, show a banner at the top with a button to open
  system settings, and grey out the toggles.

ACCEPTANCE
- Every toggle is honoured by both local and push paths.
- Quiet hours suppress notifications in the window, including across midnight.
- Turning schedule reminders off cancels the already-scheduled local ones.
- Changing the lead time from 15 to 30 reschedules existing reminders.
- A new user gets a preferences row automatically.

DO NOT
Add per-group or per-friend notification settings.
```

---

# Phase 9 — Group challenges

## 9.1 — Challenge schema and creation

```
GOAL
"September Walking Challenge — 100,000 steps as a group."

BUILD
Create supabase/migrations/009_challenges.sql:

  challenges
    id uuid PK
    group_id uuid -> groups(id) on delete cascade
    title text not null, 3..80 chars
    description text null
    metric text not null check (metric in ('steps','minutes','km','sessions'))
    target numeric not null check (> 0)
    starts_on date not null
    ends_on date not null check (ends_on >= starts_on)
    is_active boolean not null default true
    created_by uuid -> profiles(id)
    created_at, updated_at
    index on (group_id, is_active)

  challenge_contributions           -- one row per member per day, so progress is
    id uuid PK                      -- editable and chartable without a running total
    challenge_id uuid -> challenges(id) on delete cascade
    user_id uuid -> profiles(id) on delete cascade
    contribution_date date not null
    amount numeric not null check (> 0)
    created_at, updated_at
    UNIQUE (challenge_id, user_id, contribution_date)
    index on (challenge_id)

  RLS:
    challenges: select is_group_member; write is_group_admin
    contributions: select is_group_member of the challenge's group;
                   insert/update/delete user_id = auth.uid() AND member
                   AND contribution_date between starts_on and ends_on

  get_challenge_progress(p_challenge_id uuid) returns json
    total contributed, target, percentage, days remaining, participant count,
    and a per-member leaderboard of totals.

- Admin creates and edits challenges from Manage group.
- Only one active challenge per group at a time — enforce it.

ACCEPTANCE
  1. Admin creates a challenge      -> visible to all members
  2. Non-admin tries to create      -> rejected by RLS
  3. ends_on before starts_on       -> rejected by the check constraint
  4. A contribution dated outside the window -> rejected by RLS
  5. A second active challenge      -> blocked
  6. Progress math is correct against the raw rows

DO NOT
Add automatic step counting, device integration, or prizes.
```

## 9.2 — Contributions and progress

```
GOAL
Members add their numbers and watch the group bar fill up.

BUILD
- Challenge card on the group screen and on Home:
      September 100K Steps
      67,500 / 100,000     [========------]  67%
      12 days left · 18 of 20 members contributing
- "Add today's contribution": a single number input with the metric as the unit.
  Upserts on (challenge_id, user_id, contribution_date) so re-entering today
  corrects rather than duplicates.
- Leaderboard: members by total contribution, with your own row highlighted.
  Frame it as contribution, not competition — no "last place" styling.
- Milestone notifications at 50%, 75% and 100% via task 8.4, sent once each.
- Completed challenges move to a "Past challenges" list with the final result.

ACCEPTANCE
  1. Add 5,000 -> group total and percentage both update
  2. Re-enter today's number -> corrects, does not double count
  3. Contribute for a past date within the window -> allowed
  4. Contribute for a date outside the window -> blocked with a clear message
  5. Crossing 50% fires exactly one notification, not one per member
  6. 0% and 100% both render correctly
  7. A challenge that has ended is read-only

DO NOT
Add automatic tracking, badges, or prizes.
```

---

# Phase 10 — One-to-one chat

## 10.1 — Chat schema and RLS

```
GOAL
Private one-to-one messaging between friends.

BUILD
Create supabase/migrations/010_chat.sql:

  conversations
    id uuid PK
    user_a uuid -> profiles(id) on delete cascade
    user_b uuid -> profiles(id) on delete cascade
    last_message_at timestamptz null
    created_at
    check (user_a < user_b)          -- normalised pair, enforced at insert
    UNIQUE (user_a, user_b)

  messages
    id uuid PK
    conversation_id uuid -> conversations(id) on delete cascade
    sender_id uuid -> profiles(id) on delete cascade
    body text not null, 1..2000 chars
    created_at timestamptz not null default now()
    index on (conversation_id, created_at desc)

  message_reads
    conversation_id uuid -> conversations(id) on delete cascade
    user_id uuid -> profiles(id) on delete cascade
    last_read_at timestamptz not null default now()
    PRIMARY KEY (conversation_id, user_id)

  Helper: in_conversation(cid uuid) -> boolean (SECURITY DEFINER)

  RLS:
    conversations: select in_conversation(id)
                   insert: caller is one of the pair AND are_friends(other)
                           AND NOT is_blocked_either_way(other)
    messages:      select in_conversation(conversation_id)
                   insert sender_id = auth.uid() AND in_conversation(...)
                          AND NOT blocked either way
                   update/delete: none in V1
    message_reads: select/insert/update where user_id = auth.uid()
                   AND in_conversation(...)

  RPC get_or_create_conversation(p_other_user uuid): normalises the pair, checks
  friendship and blocks, upserts, returns the conversation.

ACCEPTANCE
  1. C cannot select A and B's messages                 -> 0 rows
  2. A messages a non-friend                            -> rejected
  3. A messages a user who blocked them                 -> rejected
  4. get_or_create_conversation called twice            -> one row, both orders
  5. A 2001-character message                           -> rejected
  6. Deleting a user cascades their conversations and messages

DO NOT
Add group chat, attachments, message editing, or deletion.
```

## 10.2 — Conversation list and thread

```
GOAL
The chat UI.

BUILD
- Chat entry point: an icon in the Friends tab header, plus "Message" on the
  friend profile.
- Conversation list: avatar, name, last message preview, relative timestamp,
  unread count badge. Sorted by last_message_at descending.
- Thread screen: messages newest at the bottom, own messages right-aligned with
  the accent colour, theirs left-aligned. Timestamps grouped by day with a date
  separator. Paginate 30 at a time, loading older on scroll-up.
- Input: multiline, send button disabled when empty, 2000-char limit with a
  counter past 1900. Optimistic send with a "sending" state and a retry on failure.
- Keyboard handling must be correct on both platforms — the input stays visible.

ACCEPTANCE
- Sending appears instantly and reconciles with the server.
- A failed send shows a retry affordance, not a silent loss.
- 200 messages scroll and paginate smoothly.
- Empty state: "Say hello to {name}."
- The keyboard does not cover the input on either platform.
- The unread badge clears when the thread is opened.

DO NOT
Add typing indicators, voice notes, images, reactions, or read-receipt ticks yet.
```

## 10.3 — Realtime and read receipts

```
GOAL
Messages arrive without a refresh, and you can see what has been read.

BUILD
- Subscribe to Supabase Realtime on the messages table, filtered to the open
  conversation. Enable the realtime publication for that table and confirm RLS
  applies to realtime (it does not by default in every configuration — verify it).
- Insert new messages into the react-query cache; do not refetch the whole thread.
- Unsubscribe on unmount and on app background. Resubscribe on foreground, then
  fetch any messages missed while disconnected.
- Read state: update message_reads.last_read_at when the thread is focused and
  when a new message arrives while focused. Show a single "Read" marker under your
  own most recent message once the other party has read it.
- Conversation-list unread counts come from messages newer than last_read_at.

ACCEPTANCE
  1. Two devices, message on one    -> appears on the other within ~2 seconds
  2. Background then foreground     -> missed messages appear, no duplicates
  3. Read marker appears only after the other user actually opens the thread
  4. Unread badge is correct after receiving 3 messages while the app is closed
  5. No memory leak — open and close 20 threads, subscription count stays flat
  6. Poor network -> falls back to polling or manual refresh rather than freezing

DO NOT
Add presence, online status, or typing indicators.
```

---

# Phase 11 — Sharing and reactions

## 11.1 — Share a completed activity

```
GOAL
"Raj completed 30 minutes of walking."

BUILD
Create supabase/migrations/011_sharing.sql:
  Use the existing activities.visibility column ('private' | 'friends' | 'groups').
  Add activity_shares (activity_id, group_id) for group-scoped shares, PK on both.

  Extend the activities RLS select policy to:
    user_id = auth.uid()
    OR (visibility = 'friends' AND are_friends(user_id))
    OR (visibility = 'groups' AND exists a share row for a group I am in)
  Blocked users must never see each other's activities — include
  NOT is_blocked_either_way(user_id) in the policy.

App:
- On the activity log form, a visibility selector: Private (default) /
  Friends / Choose groups.
- A "Share" action on an existing activity to change it later.
- The user's default visibility is a preference in Settings (default: Private —
  privacy-conscious by default, as the brief requires).

ACCEPTANCE
  1. A private activity is invisible to friends           -> 0 rows for them
  2. A friends-visible activity appears for friends only
  3. A group-shared activity appears for that group's members only
  4. A blocked user never sees it, at any visibility
  5. Changing visibility from friends to private removes it from their feed
  6. Default for a new user is Private

DO NOT
Build a public feed or a discovery surface.
```

## 11.2 — My Circle feed and reactions

```
GOAL
The social payoff: see that your friends showed up, and cheer them on.

BUILD
Add to migration 011:
  reactions
    activity_id uuid -> activities(id) on delete cascade
    user_id uuid -> profiles(id) on delete cascade
    emoji text not null check (emoji in ('like','strong','fire','heart'))
    created_at, updated_at
    PRIMARY KEY (activity_id, user_id)     -- one reaction per user, changeable
  RLS: select where the activity is visible to you; insert/update/delete where
  user_id = auth.uid() AND the activity is visible to you.

App:
- "My Circle" section on Home: today's activity from friends and group members,
  max 5 entries, each one line — avatar, "Arun — Walking, 30 min", reaction row.
- A full Circle screen with the last 7 days, paginated.
- Reactions: a row of four emoji. Tapping sets or changes yours; tapping your own
  again removes it. Counts shown next to each. Optimistic, with rollback.
- Keep it deliberately minimal. This is not a social media feed — no comments,
  no sharing onward, no algorithmic ordering. Reverse chronological only.

ACCEPTANCE
  1. A friend's shared activity appears in My Circle
  2. A private activity never appears
  3. React -> count updates instantly; reload confirms it persisted
  4. Change reaction -> old count down, new up, still one reaction
  5. Tap your own reaction again -> removed
  6. Empty state: "Your circle has been quiet today."
  7. A blocked user's activity never appears

DO NOT
Add comments, an infinite feed, algorithmic ranking, or share-to-other-apps.
```

---

# Phase 12 — Privacy and account

## 12.1 — Privacy controls

```
GOAL
Users decide who can see and contact them.

BUILD
Add to profiles:
  activity_visibility  text not null default 'friends'
                       check in ('friends','groups','private')
  allow_friend_requests text not null default 'everyone'
                       check in ('everyone','nobody')
  allow_messages_from  text not null default 'friends'
                       check in ('friends','nobody')
  show_in_search       boolean not null default true

- Enforce every one of these SERVER-SIDE:
    search_users excludes show_in_search = false
    the friendships insert policy checks the target's allow_friend_requests
    the messages insert policy checks the recipient's allow_messages_from
    the activities select policy respects activity_visibility
- Settings > Privacy screen with each control and a one-line plain-English
  explanation of what it does.

ACCEPTANCE
  1. show_in_search off        -> the user cannot be found in search
  2. allow_friend_requests nobody -> requests to them are rejected by RLS
  3. allow_messages_from nobody   -> messages to them are rejected by RLS
  4. activity_visibility private  -> friends see nothing, even for shared activities
  5. Every control is enforced by RLS, not only hidden in the UI — verify each by
     calling the API directly, bypassing the app
  6. Email addresses appear in no API response anywhere in the app

DO NOT
Add per-friend or per-group overrides.
```

## 12.2 — Account deletion and data export

```
GOAL
Let users leave with their data. Google Play requires an in-app account deletion
path for any app with accounts — this is not optional.

BUILD
- Settings > Account:
    Export my data   -> builds a JSON file of the user's profile, activities,
                        check-ins, schedules, groups, challenge contributions and
                        messages they sent, then opens the OS share sheet.
    Delete account   -> a two-step confirmation requiring the user to type DELETE,
                        with a plain list of exactly what will be removed.
- A delete_my_account() RPC, SECURITY DEFINER: deletes the auth.users row, which
  cascades everything. Before deleting, reassign or delete any group where the
  user is the sole admin — a group must never be left admin-less. State the chosen
  rule in the confirmation text.
- Also delete the user's avatar object from Storage.

ACCEPTANCE
  1. Export produces valid JSON containing the user's own data and nobody else's
  2. Delete removes the auth user and cascades every related row — verify each table
  3. A sole admin deleting their account leaves no admin-less group
  4. The avatar object is gone from Storage
  5. After deletion, logging in with those credentials fails
  6. Deletion requires the typed confirmation

DO NOT
Add a soft-delete or a recovery window. Deletion means deletion.
```

---

# Phase 13 — Polish and ship

## 13.1 — Home screen final

```
GOAL
Assemble the real Home screen now that every section exists.

BUILD
Final order — most actionable at the top:
  1. Greeting by local time
  2. Morning check-in / evening outcome card
  3. Today's group polls, votable inline, unvoted groups first
  4. Streak card
  5. My Circle — max 5 entries
  6. Active group challenge progress
  7. Next upcoming reminder
Cap the screen: at most 7 sections, and hide any section with nothing to show.

Empty states, which most new users hit first:
  - Nothing at all: one friendly card -> Create or join a group / Find friends
  - No groups but has friends: show circle and streak, prompt to join a group
  - Everything done: "You're done for today. See you tomorrow." plus the streak

Pull to refresh refetches everything. Refetch on app foreground.

ACCEPTANCE
- A brand-new user sees exactly one obvious next action.
- A fully-loaded user (3 groups, 10 friends, an active challenge) can still read
  the screen in 5 seconds and does not need to scroll to reach the check-in.
- Loads in under 1.5 seconds on a normal connection.
- All sections render correctly at the largest OS font size.

DO NOT
Add sections beyond the seven listed.
```

## 13.2 — Loading, empty, error and offline pass

```
GOAL
Every screen behaves well when things are slow, empty or broken.

BUILD
Walk every screen in the app and verify or fix:
  - Loading: skeleton or spinner, never a blank white screen
  - Empty: explains the situation and offers the next action
  - Error: plain English plus a Retry button, never a raw error object
  - Offline: a persistent "You're offline" banner; reads serve cached data;
    writes fail with a clear message and no data loss
  - Every button: disabled plus spinner while working, double-tap safe
  - Every destructive action: confirm dialog
  - Slow network: nothing blocks the UI thread; no unbounded spinners
Then: spacing consistent with theme.ts, tap targets at least 44pt, no clipped
text at the largest OS font size, a real app icon and splash screen.

ACCEPTANCE
Produce a table: every screen x (loading, empty, error, offline), pass/fail per
cell. Report failures honestly rather than quietly fixing and over-claiming.
```

## 13.3 — TESTING.md and full regression run

```
GOAL
A written checklist to run before every release.

BUILD
Create TESTING.md with exact steps and expected results for:
  Auth:        new user, existing user, wrong password, duplicate email, reset,
               session persistence, logout
  Profile:     edit, photo upload, permission denied, timezone change
  Check-in:    morning, evening, change, 03:00 boundary, offline
  Activities:  schedule create/edit/delete, log with and without distance,
               auto-duration, future date, history pagination
  Streak:      builds, breaks, rest day, poll vote counts, multi-source single day
  Groups:      create, browse, join by code, invalid code, duplicate join, leave,
               sole-admin leave blocked, remove member, promote, delete group
  Polls:       admin create, edit options, soft-delete a voted option, reorder,
               deactivate, vote, change vote, vote after close, vote before open
  Friends:     search, request, accept, reject, cancel, remove, block, unblock
  Reminders:   personal, group, timezone change, permission denied, quiet hours
  Challenges:  create, contribute, correct a contribution, out-of-window, milestones
  Chat:        send, receive realtime, pagination, read receipts, block mid-thread
  Sharing:     private, friends, groups, reactions, blocked user invisible
  Privacy:     every control enforced server-side
  Account:     export, delete, sole-admin deletion
  Edge cases:  offline, airplane mode mid-write, app killed mid-flow, two devices
               one user, 30-member group, 1-member group, day-one group,
               largest OS font size, a user in 10 groups

Then execute the whole checklist and report every result. Do not mark anything
passed that you have not actually run.
```

## 13.4 — Android APK release

```
GOAL
An installable APK your friends can tap and install.

BUILD
- Configure EAS Build. eas.json with a 'preview' profile producing an APK
  (not AAB — an APK installs directly without the Play Store).
- Set the bundle identifier, app name, version, versionCode, icon and splash.
- Verify the built bundle contains the anon key and NOT the service_role key —
  grep the artifact and report what you found.
- Build, then write RELEASE.md: how to build, where the download link appears,
  and the exact message to send friends, including Android's "install from
  unknown sources" prompt.

ACCEPTANCE
- The APK installs on a physical Android device that has never run Expo Go.
- Register, create a group, set a poll, vote, log an activity, add a friend, chat —
  all work in the built app, not just in Expo Go.
- Push notifications work in the build (they do not work in Expo Go on Android).
- No dev warnings, debug menus or console output visible.
- grep confirms no service_role key and no Expo access token in the artifact.

DO NOT
Submit to the Play Store in this task.
```

## 13.5 — iOS build (optional)

```
GOAL
An iOS build via TestFlight. Only start this once Android is proven.

PREREQUISITES
An Apple Developer Program membership (~$99/yr). You cannot build or test iOS
locally on Windows — everything runs through EAS cloud builds, and you need a
physical iPhone or a Mac to test properly.

BUILD
- Add an iOS section to app.json: bundle identifier, build number, and usage
  descriptions for camera, photo library and notifications.
- Configure an eas.json production profile for iOS.
- Build with EAS and submit to TestFlight.
- Verify platform-specific behaviour: safe-area insets on notched devices,
  keyboard avoidance in the chat thread, the back gesture, notification
  permissions, and the date/time picker (it looks and behaves differently on iOS).

ACCEPTANCE
- The build installs via TestFlight on a physical iPhone.
- Every Phase 13.3 flow works on iOS.
- No Android-specific UI leaks through, and no layout is broken by the notch.

DO NOT
Start this before 13.4 is signed off.
```

---

## Suggested milestones

| After | You have | Do this |
|---|---|---|
| **3.4** | A working single-player daily habit app | Install it on your own phone. Use it daily. |
| **6.4** | Groups with automated daily polls | Invite 3–5 close friends. |
| **8.5** | Reminders that actually bring people back | The loop is complete. |
| **11.2** | The full social layer | Invite the rest of your 50. |
| **13.4** | A real APK | Ship it. |

**The critical moment is 3.4.** If you do not personally want to open the app every
day at that point, adding groups, chat and challenges will not fix it — stop and
fix the core loop first. Everything after Phase 3 amplifies the loop; none of it
creates one.
