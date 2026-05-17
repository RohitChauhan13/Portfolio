# Rohit Chauhan Portfolio Project Context

Use this file as the starting brief for a fresh portfolio website project.

## Decision

Create a new project folder instead of modifying this `DraftCareer` repo.

Reason: `DraftCareer` is a full-stack resume builder with user auth, resume CRUD, templates, PDF export, and Prisma. The portfolio should be a cleaner product: public recruiter-facing pages, a hidden admin panel, Supabase-managed content, and Brevo contact email. The existing repo is useful as a polish reference, not as the best base.

## Existing Project Reference

Current repo: `D:\ROHIT\DraftCareer`

Useful patterns from this repo:

- Next.js 15 App Router
- React 19 and TypeScript
- Tailwind CSS
- Lucide icons
- Clean responsive sections
- Server-side routes under `app/api`
- Brevo email sending helper in `lib/email.ts`
- Validation using Zod
- Database-driven admin settings pattern
- SEO files: `app/sitemap.ts`, `app/robots.ts`, structured data in homepage

Do not copy the current app directly. Use its quality level and production polish as the reference.

## Goal

Build a polished personal portfolio for Rohit Chauhan that impresses recruiters, founders, and technical visitors.

The website should show:

- Skills
- Projects
- Education
- Experience
- Achievements
- Resume download
- Contact form
- Social links
- Production apps and real work
- Admin-editable content

Public website should not have signup/login flows.

Admin panel must live at:

```text
/rohit/admin
```

Admin should allow Rohit to add, edit, delete, and reorder portfolio content.

## Tech Stack

Use:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Supabase for database/storage
- Brevo for contact-form email
- Zod for validation
- Lucide React for icons

Recommended UI libraries only if useful:

- `sonner` for toast messages
- `framer-motion` for subtle animation
- `@supabase/supabase-js`
- `@supabase/ssr` if auth/session helpers are needed

## Admin Protection

The public portfolio must not show login/signup.

The admin panel still needs protection. Recommended approach:

- Hidden admin URL: `/rohit/admin`
- Admin passphrase screen only at that route
- Store admin session in an HTTP-only cookie
- Keep the passphrase hash/secret in environment variables
- Do not expose Supabase service role key to the browser
- Use server actions or route handlers for writes

Alternative: Supabase Auth for only the hidden admin area, but no public auth UI.

## Main Pages

### Public

- `/` - portfolio homepage
- `/projects` - project listing, optional if homepage already has strong project depth
- `/projects/[slug]` - detailed project case study
- `/resume` - web resume or redirect/download page
- `/contact` - optional dedicated contact page

### Admin

- `/rohit/admin` - dashboard
- `/rohit/admin/projects`
- `/rohit/admin/experience`
- `/rohit/admin/skills`
- `/rohit/admin/education`
- `/rohit/admin/messages`
- `/rohit/admin/settings`

## Public Homepage Structure

First screen should immediately say who Rohit is and what he builds.

Suggested hero:

- Name: Rohit Chauhan
- Title: React Native and Full Stack Developer
- Positioning: Builds production mobile apps, backend APIs, and business workflow tools.
- Primary CTA: View Projects
- Secondary CTA: Contact Me / Download Resume
- Quick proof: 1 year professional experience, 10,000+ users/downloads, production mobile apps, API/backend work

Recommended sections:

- Hero
- Featured production work
- Skills grouped by category
- Experience timeline
- Projects/case studies
- Education
- Achievements
- Testimonials or impact stats if available
- Contact

## Resume-Derived Personal Info

Extracted from attached resume:

- Full name: Rohit Kamlesh Chauhan
- Public name: Rohit Chauhan
- Role: Hybrid App Developer / React Native / Full Stack Developer
- Location: Near RTO Office, Savali, Sangli, Maharashtra, India - 416410
- Phone: +91 7024756186
- Email: rohitchauhan6232@gmail.com
- LinkedIn: present in resume, exact URL needed
- GitHub: present in resume, exact URL needed
- Open to: Remote / Hybrid / Onsite

## Experience

Important correction from user:

Do not present Rohit as having only 6+ months of experience.

Current professional experience:

- Company: GTT Data Solutions
- Location: Sangli, Maharashtra, India
- Role: Hybrid App Developer / Full Stack Developer
- Start date: May 12, 2025
- Current date from request context: May 17, 2026
- Experience length: about 1 year

Use wording like:

- "1 year of professional experience"
- "Since May 2025"
- "Production React Native and full-stack development experience"

Avoid wording like:

- "6+ months"
- "Only 2 projects"

User note: Resume mentions major projects, but Rohit has worked on many more projects during the year. Admin panel must support adding many projects and marking some as featured.

## Resume Summary Draft

Rohit Chauhan is a React Native and Full Stack Developer with 1 year of professional experience building production mobile apps, backend APIs, and business workflow systems. He works across React Native, TypeScript, Node.js, REST APIs, MySQL, Firebase, and full-stack product delivery. His work includes production apps serving thousands of users, API architecture, database optimization, real-time features, and automation that reduces manual business workflows.

## Technical Skills

Languages:

- JavaScript ES6+
- TypeScript
- Java
- HTML
- CSS
- SQL

Frontend / Mobile:

- React Native
- Redux
- Cross-platform mobile development
- Responsive design
- Mobile app development

Backend:

- Node.js
- Express.js
- REST API development
- API integration

Databases:

- MySQL
- SQLite
- Firebase Realtime Database
- Supabase/Postgres for this new portfolio project

Tools:

- Git
- GitHub
- Postman
- JMeter
- VS Code
- Android Studio
- Debugging

Methodologies:

- Agile
- Scrum
- Sprint planning
- Code review
- Testing

Soft skills:

- Team collaboration
- Problem solving
- Communication
- Adaptability

## Known Projects From Resume

### Mai Hyundai

Production mobile app worked on at GTT Data Solutions.

Known impact from resume:

- Part of 2 production mobile apps
- 10,000+ downloads/users combined
- 4.5-star ratings mentioned
- Production uptime claim: 99.9%

Need more details from Rohit later:

- Store links
- Screenshots
- Exact features built
- Tech stack
- Role/responsibility
- Metrics

### Ticket Khidakee

Production mobile app worked on at GTT Data Solutions.

Need more details from Rohit later:

- Store links
- Screenshots
- Exact features built
- Tech stack
- Role/responsibility
- Metrics

### Medimate - Medical Store Management System

Tech:

- React Native
- Node.js
- MySQL

Impact:

- Replaced manual diary-based operations with a mobile app
- Used by/for 3 medical stores
- Inventory and credit management
- Tracks 1,000+ medicines and 500+ customer accounts
- Reduced record-keeping time by around 70%
- Saved about 15+ hours weekly for store owners

### Payroll Management System

Tech:

- Java Swing
- MySQL

Impact:

- Desktop app for 100+ employee records
- Automated salary processing
- Reduced payroll processing time by around 60%
- Reduced manual calculation errors

### AI-Powered Code Reviewer

Tech:

- JavaScript
- Node.js
- TypeScript

Impact:

- Code analysis tool
- Generates optimization and best-practice suggestions
- Covers 50+ code patterns
- Improves developer productivity

## Education

- Degree: Bachelor of Computer Applications (BCA)
- Years: 2022-2025
- Institute: Institute of Management & Rural Development Administration
- Location: Sangli, Maharashtra
- Achievement: A+ grade from Bharati Vidyapeeth, top 5% mentioned in resume

## Achievements

From resume:

- Earned A+ grade from Bharati Vidyapeeth
- Ranked in top 5% of Computer Applications students
- Launched/worked on 2 production mobile applications with 99.9% uptime serving 10,000+ users/downloads
- Improved business workflow efficiency by about 70%

Add more later from actual work after May 2025.

## Supabase Data Model

Use Supabase Postgres tables. Keep public-readable content separate from admin-only content.

Suggested tables:

### profile

- `id`
- `name`
- `headline`
- `summary`
- `email`
- `phone`
- `location`
- `github_url`
- `linkedin_url`
- `resume_url`
- `avatar_url`
- `open_to`
- `created_at`
- `updated_at`

### skills

- `id`
- `name`
- `category`
- `proficiency`
- `sort_order`
- `is_featured`
- `created_at`
- `updated_at`

### projects

- `id`
- `title`
- `slug`
- `short_description`
- `case_study`
- `tech_stack`
- `role`
- `impact`
- `image_url`
- `github_url`
- `live_url`
- `store_url`
- `is_featured`
- `sort_order`
- `status`
- `started_at`
- `completed_at`
- `created_at`
- `updated_at`

### experience

- `id`
- `company`
- `role`
- `location`
- `start_date`
- `end_date`
- `is_current`
- `summary`
- `highlights`
- `tech_stack`
- `sort_order`
- `created_at`
- `updated_at`

### education

- `id`
- `institution`
- `degree`
- `location`
- `start_year`
- `end_year`
- `grade`
- `highlights`
- `sort_order`
- `created_at`
- `updated_at`

### achievements

- `id`
- `title`
- `description`
- `date`
- `sort_order`
- `is_featured`
- `created_at`
- `updated_at`

### contact_messages

- `id`
- `name`
- `email`
- `subject`
- `message`
- `source`
- `read_at`
- `created_at`

### site_settings

- `id`
- `key`
- `value`
- `updated_at`

## Supabase Security Notes

- Enable RLS on all public schema tables.
- Public site can read published portfolio content.
- Only server-side admin endpoints should write.
- Never expose Supabase service role key in frontend code.
- Store service role key only in server environment variables.
- Contact messages should not be publicly readable.
- Admin writes should be guarded by the hidden admin session.

Before implementation, verify the current Supabase docs/changelog because Supabase APIs and SSR helpers change.

## Brevo Contact Form

Contact form fields:

- Name
- Email
- Subject
- Message

Behavior:

- Validate with Zod.
- Store message in Supabase `contact_messages`.
- Send email to Rohit via Brevo.
- Optionally send auto-reply to visitor.
- Rate-limit or add honeypot to reduce spam.

Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME="Rohit Chauhan Portfolio"
CONTACT_TO_EMAIL="rohitchauhan6232@gmail.com"
NEXT_PUBLIC_SITE_URL=
```

## Visual Direction

Make it feel like a serious developer portfolio, not a generic landing page.

Style goals:

- Clean, modern, recruiter-friendly
- Strong typography
- Clear proof and metrics
- Mobile-first responsive
- Project cards that show real impact
- Case-study style project pages
- Admin UI should be dense and practical

Avoid:

- Generic template feel
- Too much purple/blue gradient styling
- Fake decorative UI that hides real work
- Overly playful copy
- Public login/signup buttons

## Admin Features

Admin dashboard should support:

- Edit profile/header content
- Add/edit/delete projects
- Mark projects as featured
- Reorder projects
- Add/edit/delete experience entries
- Add/edit/delete skills
- Add/edit/delete education
- Add/edit/delete achievements
- View contact messages
- Mark messages as read
- Upload or set image URLs for project images/avatar/resume

## SEO / Recruiter Polish

Add:

- Metadata per page
- Open Graph image
- `sitemap.ts`
- `robots.ts`
- JSON-LD Person schema
- JSON-LD WebSite schema
- Project pages with clean slugs
- Resume download CTA
- Fast performance
- Accessible forms and buttons

## Build Order

1. Create new Next.js app.
2. Install Tailwind, Supabase, Zod, Lucide, Sonner.
3. Configure Supabase clients and environment variables.
4. Create database schema and RLS policies.
5. Seed profile, skills, education, experience, and known projects.
6. Build public portfolio pages.
7. Build contact form with Brevo.
8. Build hidden admin protection.
9. Build admin CRUD screens.
10. Add SEO, metadata, sitemap, robots, and polish.
11. Run production build.
12. Deploy.

## Open Info Needed Later

Ask Rohit for:

- Exact LinkedIn URL
- Exact GitHub URL
- Current best resume PDF to use
- Profile photo/avatar preference
- Store links for Mai Hyundai and Ticket Khidakee
- Additional projects completed after May 2025
- Screenshots or logos for production apps
- Preferred deployment target
- Supabase project credentials
- Brevo sender email and API key

