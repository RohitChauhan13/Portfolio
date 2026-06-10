# Rohit Portfolio

Portfolio website for Rohit Chauhan with a public recruiter-facing site, project case studies, a contact workflow, and a hidden admin panel at `/rohit/admin`.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Postgres through `pg`
- Brevo transactional email
- Groq AI for admin copy enhancement and contact review
- Zod validation
- GSAP motion

## Local Setup

```bash
npm install
npm run dev
```

Create `.env` or `.env.local` from `.env.example`.

## Environment Variables

Required for production on Vercel:

```env
NEXT_PUBLIC_SITE_URL="https://your-vercel-domain.vercel.app"
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
BREVO_API_KEY=""
BREVO_SENDER_EMAIL=""
BREVO_SENDER_NAME="Rohit Chauhan Portfolio"
CONTACT_TO_EMAIL="rohitchauhan6232@gmail.com"
ADMIN_SESSION_SECRET=""
GROQ_API_KEY=""
GROQ_MODELS="qwen/qwen3-32b,llama-3.3-70b-versatile,meta-llama/llama-4-scout-17b-16e-instruct,groq/compound-mini,groq/compound"
```

Notes:

- `DATABASE_URL` should be a Supabase pooled Postgres connection string for Vercel/serverless.
- `ADMIN_SESSION_SECRET` should be a long random string.
- `GROQ_API_KEY` and `GROQ_MODELS` enable admin AI enhancement and AI contact review.
- `BREVO_*` values enable live contact emails. In development, missing Brevo values log the email instead.
- Do not commit `.env` or `.env.local`.

## Database

Run the idempotent schema/seed migration:

```bash
npm run db:migrate
```

Create or update an admin user:

```bash
npm run admin:create -- your@email.com "your-strong-password"
```

The migration is safe to run more than once. It creates tables, RLS policies, public read grants, private admin/message tables, initial portfolio content, site settings, and duplicate-prevention indexes.

## Admin

Open:

```text
/rohit/admin
```

Admin supports:

- Profile and social links
- Projects
- Skills
- Experience
- Education
- Achievements
- Contact messages
- Site config, including the public-site casual inspect deterrent
- AI enhancement with before/after review for portfolio copy fields

## Contact Flow

The public contact form validates and limits input on both the client and server:

- Name: 80 characters
- Email: 120 characters
- Subject: 100 characters
- Message: 500 characters

When Groq is configured, contact submissions are reviewed before saving/sending:

- Valid messages are stored in Postgres and receive an AI-written thank-you email through Brevo.
- AI can detect normal, happy, or angry tone and write the reply around the sender's message.
- Multilingual messages are supported, including English, Hindi, Marathi, Hinglish, and romanized Indian-language text.
- Fake/random messages are rejected with a correction prompt.
- Spam or vulgar messages are rejected and shown in a warning modal.
- Known abusive romanized Marathi/Hindi terms are also blocked locally as a safety fallback.
- If AI fails or is unavailable, valid messages continue through the old default email flow.

## Inspect Deterrent

The admin config can enable a casual inspect deterrent on public pages. It blocks right-click, drag, and common inspect/source shortcuts such as F12 and Ctrl+Shift+I.

This is not a security boundary. Browser DevTools, source viewing, and network inspection cannot be fully blocked by website code. Keep secrets on the server only.

## SEO

SEO is handled with:

- Central metadata helpers in `lib/seo.ts`
- Dynamic page metadata for the home page and project detail pages
- Open Graph and Twitter card metadata
- Canonical URLs based on `NEXT_PUBLIC_SITE_URL`
- Person, WebSite, Project, Breadcrumb, and ItemList JSON-LD
- Dynamic `sitemap.xml`
- `robots.txt` that allows public pages and blocks `/api` plus `/rohit/admin`
- Admin layout metadata with `noindex`, `nofollow`, and `nocache`

Keep `NEXT_PUBLIC_SITE_URL` updated to the final production domain so canonical URLs, sitemap entries, and social previews are correct.

## Vercel Deployment

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave default
- Development Command: leave default

Before deployment:

1. Push the project to GitHub.
2. Add all production environment variables in Vercel.
3. Run `npm run db:migrate` locally against the production database.
4. Run `npm run admin:create -- your@email.com "your-password"` locally against the production database.
5. Deploy on Vercel.

After first deploy, update `NEXT_PUBLIC_SITE_URL` to the final Vercel/custom domain and redeploy.

## Useful Commands

```bash
npm run dev
npm run build
npm run db:migrate
npm run admin:create -- your@email.com "your-password"
```
