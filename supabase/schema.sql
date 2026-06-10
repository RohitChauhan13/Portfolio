create extension if not exists pgcrypto;

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  public_name text not null,
  headline text not null,
  summary text not null,
  email text not null,
  phone text not null,
  location text not null,
  github_url text default '',
  linkedin_url text default '',
  instagram_url text default '',
  resume_url text default '/resume.pdf',
  avatar_url text default '',
  open_to text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency integer not null default 75 check (proficiency between 0 and 100),
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  case_study text not null default '',
  created_for text not null default '',
  tech_stack text[] not null default '{}',
  role text not null default '',
  impact text[] not null default '{}',
  image_url text not null default '',
  demo_url text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  store_url text not null default '',
  status text not null default 'Draft',
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text not null default '',
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  summary text not null default '',
  highlights text[] not null default '{}',
  tech_stack text[] not null default '{}',
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  location text not null default '',
  start_year text not null default '',
  end_year text not null default '',
  grade text not null default '',
  highlights text[] not null default '{}',
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  date text not null default '',
  is_featured boolean not null default false,
  sort_order integer not null default 99,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  source text not null default 'portfolio',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  email text primary key,
  password_hash text not null,
  password_salt text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.achievements enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profile, public.skills, public.projects, public.experience, public.education, public.achievements, public.site_settings to anon, authenticated;
revoke all on public.contact_messages from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;

drop policy if exists "Public portfolio profile read" on public.profile;
create policy "Public portfolio profile read" on public.profile for select to anon, authenticated using (true);

drop policy if exists "Public portfolio skills read" on public.skills;
create policy "Public portfolio skills read" on public.skills for select to anon, authenticated using (true);

drop policy if exists "Public portfolio projects read" on public.projects;
create policy "Public portfolio projects read" on public.projects for select to anon, authenticated using (true);

drop policy if exists "Public portfolio experience read" on public.experience;
create policy "Public portfolio experience read" on public.experience for select to anon, authenticated using (true);

drop policy if exists "Public portfolio education read" on public.education;
create policy "Public portfolio education read" on public.education for select to anon, authenticated using (true);

drop policy if exists "Public portfolio achievements read" on public.achievements;
create policy "Public portfolio achievements read" on public.achievements for select to anon, authenticated using (true);

drop policy if exists "Public portfolio site settings read" on public.site_settings;
create policy "Public portfolio site settings read" on public.site_settings for select to anon, authenticated using (true);

alter table public.profile add column if not exists instagram_url text default '';
alter table public.projects add column if not exists created_for text not null default '';
alter table public.projects add column if not exists demo_url text not null default '';
alter table public.projects add column if not exists is_visible boolean not null default true;
alter table public.skills add column if not exists is_visible boolean not null default true;

with ranked_skills as (
  select
    id,
    row_number() over (
      partition by lower(name), lower(category)
      order by sort_order asc, created_at asc, id asc
    ) as duplicate_rank
  from public.skills
)
delete from public.skills
where id in (
  select id from ranked_skills where duplicate_rank > 1
);

create unique index if not exists skills_name_category_unique
on public.skills (name, category);

with ranked_experience as (
  select
    id,
    row_number() over (
      partition by lower(company), lower(role), start_date
      order by sort_order asc, created_at asc, id asc
    ) as duplicate_rank
  from public.experience
)
delete from public.experience
where id in (
  select id from ranked_experience where duplicate_rank > 1
);

create unique index if not exists experience_company_role_start_unique
on public.experience (company, role, start_date);

with ranked_education as (
  select
    id,
    row_number() over (
      partition by lower(institution), lower(degree), start_year, end_year
      order by sort_order asc, created_at asc, id asc
    ) as duplicate_rank
  from public.education
)
delete from public.education
where id in (
  select id from ranked_education where duplicate_rank > 1
);

create unique index if not exists education_degree_institution_years_unique
on public.education (institution, degree, start_year, end_year);

with ranked_achievements as (
  select
    id,
    row_number() over (
      partition by lower(title), date
      order by sort_order asc, created_at asc, id asc
    ) as duplicate_rank
  from public.achievements
)
delete from public.achievements
where id in (
  select id from ranked_achievements where duplicate_rank > 1
);

create unique index if not exists achievements_title_date_unique
on public.achievements (title, date);

insert into public.profile (name, public_name, headline, summary, email, phone, location, github_url, linkedin_url, instagram_url, resume_url, open_to)
values (
  'Rohit Kamlesh Chauhan',
  'Rohit Chauhan',
  'React Native and Full Stack Developer',
  'I build production mobile apps, backend APIs, and business workflow tools with React Native, TypeScript, Node.js, MySQL, Firebase, and Supabase.',
  'rohitchauhan6232@gmail.com',
  '+91 7024756186',
  'Sangli, Maharashtra, India',
  'https://github.com/RohitChauhan13',
  '',
  '',
  '/resume.pdf',
  'Remote, hybrid, and onsite roles'
)
on conflict do nothing;

insert into public.site_settings (key, value) values
('inspect_protection_enabled', 'false')
on conflict (key) do nothing;

insert into public.skills (name, category, proficiency, is_featured, sort_order) values
('React Native', 'Mobile', 92, true, 1),
('TypeScript', 'Languages', 88, true, 2),
('Node.js', 'Backend', 86, true, 3),
('REST APIs', 'Backend', 88, true, 4),
('MySQL', 'Database', 84, true, 5),
('Firebase', 'Database', 78, true, 6),
('Supabase', 'Database', 76, true, 7),
('Redux', 'Frontend', 82, false, 8),
('Java', 'Languages', 72, false, 9),
('JMeter', 'Tools', 70, false, 10)
on conflict (name, category) do nothing;

insert into public.projects (title, slug, short_description, case_study, created_for, tech_stack, role, impact, image_url, demo_url, github_url, live_url, store_url, status, is_featured, is_visible, sort_order) values
 ('Mai Hyundai', 'mai-hyundai', 'Production mobile app work for a dealership workflow and customer experience platform.', 'Contributed to production React Native app delivery, API integration, state management, testing, and performance improvements for a real business audience.', 'Dealership workflow and customer experience platform', array['React Native','TypeScript','Node.js','REST APIs','MySQL','Firebase'], 'Hybrid App Developer', array['Part of production app delivery','Supported real users at scale','Improved app stability and workflow speed'], '/projects/default.svg', '', '', '', '', 'Production', true, true, 1),
 ('Ticket Khidakee', 'ticket-khidakee', 'Production ticketing mobile app work across frontend flows, API integration, and stability.', 'Worked on production-grade mobile experiences with React Native, backend API coordination, Redux state flows, and debugging for smoother releases.', 'A ticketing mobile app for customers and event organizers', array['React Native','Redux','TypeScript','Node.js','MySQL'], 'Hybrid App Developer / Full Stack Developer', array['Production app experience','Contributed to reliable user flows','Worked inside Agile delivery cycles'], '/projects/default.svg', '', '', '', '', 'Production', true, true, 2),
 ('Medimate', 'medimate', 'Medical store management app for inventory, credit records, and daily operations.', 'Replaced diary-based store workflows with a mobile application that tracks medicines, customers, credit balances, and inventory updates for medical stores.', 'Medical store inventory and credit management', array['React Native','Node.js','MySQL'], 'Full Stack Developer', array['Reduced record-keeping time by 70%','Tracked 1,000+ medicines','Managed 500+ customer accounts','Saved 15+ hours weekly'], '/projects/default.svg', '', '', '', '', 'Case study', true, true, 3)
on conflict (slug) do nothing;

insert into public.projects (title, slug, short_description, case_study, created_for, tech_stack, role, impact, image_url, demo_url, github_url, live_url, store_url, status, is_featured, is_visible, sort_order) values
('DraftCareer', 'draft-career', 'A career-planning and job-application helper web app.', 'Built a lightweight web application to help users draft resumes, track job applications, and prepare interview notes. Implemented editable templates, export to PDF, and integrations with GitHub for profile linking.', 'Job seekers needing structured resume and application workflow', array['React','TypeScript','Node.js'], 'Full Stack Developer', array['Provides reusable resume templates','Streamlines application tracking','Exports professional PDFs'], '/projects/draft-career.svg', '', 'https://github.com/RohitChauhan13/DraftCareer', '', '', 'Project', false, true, 6)
on conflict (slug) do nothing;

insert into public.experience (company, role, location, start_date, is_current, summary, highlights, tech_stack, sort_order) values
('GTT Data Solutions', 'Hybrid App Developer / Full Stack Developer', 'Sangli, Maharashtra, India', '2025-05-12', true, 'Building and maintaining production mobile applications, APIs, integrations, and database-backed workflows.', array['Engineered React Native production app features across mobile and backend layers','Built and integrated REST APIs with Node.js, TypeScript, and MySQL','Improved state management with Redux and reduced debugging time','Optimized MySQL queries and tested performance with JMeter','Worked in Agile sprints with GitHub-based reviews and releases'], array['React Native','TypeScript','Node.js','Redux','MySQL','Firebase','JMeter'], 1)
on conflict (company, role, start_date) do nothing;

insert into public.education (institution, degree, location, start_year, end_year, grade, highlights, sort_order) values
('Institute of Management & Rural Development Administration', 'Bachelor of Computer Applications', 'Sangli, Maharashtra', '2022', '2025', 'A+ Grade', array['Bharati Vidyapeeth','Top 5% of Computer Applications students'], 1)
on conflict (institution, degree, start_year, end_year) do nothing;

insert into public.achievements (title, description, date, is_featured, sort_order) values
('1 year of professional product work', 'Completed a year of hands-on React Native and full-stack development from May 12, 2025.', '2026', true, 1),
('Production mobile app delivery', 'Worked on production apps with thousands of users/downloads and reliability-focused releases.', '2025-2026', true, 2),
('A+ grade in BCA', 'Earned A+ grade from Bharati Vidyapeeth and ranked in the top 5% of Computer Applications students.', '2025', true, 3)
on conflict (title, date) do nothing;
