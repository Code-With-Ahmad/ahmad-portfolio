# Portfolio

A fullstack, fully animated personal portfolio — dark/light editorial design, live-editable through a hidden admin dashboard backed by Firebase. No redeploy needed to change content: edit in the dashboard, the public site updates immediately.

## Tech stack

- **Frontend:** React 19 (Vite), Tailwind CSS v4
- **Animation:** GSAP + ScrollTrigger (scroll-driven reveals), Framer Motion (page transitions, micro-interactions)
- **Icons:** React Icons
- **Data:** Firebase Firestore (all content)
- **File uploads:** Cloudinary (resume PDF, project/branding images) via signed direct-to-Cloudinary uploads
- **Admin auth:** A single password (env var) → serverless function mints a Firebase custom token → Firestore security rules (and the upload-signing function) enforce the real write permission
- **Contact form:** Resend (email delivery) via a serverless function
- **Hosting:** Vercel (serverless functions in `/api`, SPA rewrites in `vercel.json`)

## Project structure

```
api/                   Vercel serverless functions (admin login, upload signing, contact form, sitemap)
src/
  animations/          GSAP setup + text-reveal helpers
  components/
    admin/             Admin dashboard screens (one per content type)
    layout/            Navbar, Footer, theme toggle, cursor, SEO, error boundary
    sections/          Public page sections (Hero, About, Skills, ...)
    ui/                Small shared UI primitives
  context/             Theme + admin-auth React context
  firebase/            Firestore/Auth read/write helpers, Cloudinary upload client
  hooks/               Data-fetching and utility hooks
  lib/                 Placeholder content, icon map, misc utils
  pages/               Route-level pages (Home, ProjectDetail, AdminRoot, NotFound)
firestore.rules         Firestore security rules
```

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values (see below)
npm run dev
```

The site runs immediately with realistic **placeholder content** even before Firebase is configured — every section falls back to placeholder data until Firestore actually has documents in it.

`npm run dev` also serves the `/api/*.js` functions (admin login, uploads, contact form, sitemap) locally, so the admin dashboard works out of the box in dev — no separate tool needed. This is done by a small Vite plugin (`vite-plugins/localApiMiddleware.js`) that runs those same files directly inside the dev server; the files themselves are unchanged and deploy to Vercel exactly as they are. (An earlier approach used the Vercel CLI's own `vercel dev` for this, but it has a real bug with this project's Vite version that corrupts non-ASCII characters mid-request — this local middleware sidesteps that entirely.)

## Setting up Firebase (step by step)

Firebase here is used for two things only: **Firestore** (the database holding all your content) and **Authentication** (just to gate the admin dashboard). File uploads go through Cloudinary instead (see next section) — Firebase's Storage product requires a paid Blaze plan to even enable, so this project deliberately avoids it and stays entirely on Firebase's free Spark plan.

1. **Create the project**
   Go to [console.firebase.google.com](https://console.firebase.google.com) → "Add project" → name it anything (e.g. `my-portfolio`) → you can disable Google Analytics for this project, it isn't needed → Create.

2. **Register a Web App**
   In the project overview, click the **`</>`** (web) icon → give it a nickname → Register app (leave "Firebase Hosting" unchecked). Firebase will show you a `firebaseConfig` object — copy those values into your `.env` as the `VITE_FIREBASE_*` variables:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. **Enable Firestore**
   Left sidebar → Databases & Storage → Firestore Database → Create database → start in **production mode** (the rules in this repo handle access control) → pick any region close to you.

4. **Enable Authentication**
   Left sidebar → Build/Authentication → Get started. You don't need to enable any sign-in providers — this project only ever uses one server-minted custom-token identity for the admin session, never a real sign-in method.

5. **Publish the security rules**
   Open `firestore.rules` from this repo. In the console: Firestore Database → Rules tab → paste its contents → Publish.
   (If you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and prefer that: `firebase deploy --only firestore:rules` — `firebase.json` in this repo is already set up for it.)

6. **Generate an Admin SDK service account** (this is what lets the serverless functions mint the admin's custom token and verify it later — separate from the public web config above)
   Project settings (gear icon) → Service accounts tab → Generate new private key → a JSON file downloads. Open it and copy three fields into `.env`:
   ```
   FIREBASE_ADMIN_PROJECT_ID=<project_id from the JSON>
   FIREBASE_ADMIN_CLIENT_EMAIL=<client_email from the JSON>
   FIREBASE_ADMIN_PRIVATE_KEY="<private_key from the JSON, keep the \n's and the quotes>"
   ```
   **Never commit this file or these values** — the service account has full admin access to your Firebase project. `.env` is already gitignored.

7. **Set your admin password**
   ```
   ADMIN_PASSWORD=pick-something-long-and-random
   ```
   This is the only credential gating `/admin`. See **Admin dashboard & security model** below for how this is enforced and its trade-offs.

That's the whole Firebase side. Restart `npm run dev` after editing `.env` (Vite only reads env vars at startup).

## Setting up Cloudinary (file uploads)

Cloudinary handles the resume PDF and every image (project covers/galleries, logo, favicon). Its free tier (25GB storage/bandwidth) needs no card:

1. Sign up free at [cloudinary.com](https://cloudinary.com).
2. Your dashboard home page shows **Cloud name**, **API Key**, and **API Secret** directly — copy all three into `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. That's it — no upload presets or extra configuration needed. Uploads are authorized by `/api/upload-signature.js`, which only signs a request after verifying (via the Firebase Admin SDK) that the caller is genuinely logged in as the admin. The API secret never reaches the browser.

**Gotcha (already handled in code, documented here in case it resurfaces):** Cloudinary blocks direct delivery of PDFs uploaded as an `image` resource on new accounts (a security default) — clicking "Download Resume" would 404/401. The resume upload (`src/firebase/storage.js`) uploads non-image files through Cloudinary's `raw` endpoint instead of `image`/`auto`, which isn't subject to that restriction. If you ever see a 401 from `res.cloudinary.com/.../image/upload/.../*.pdf`, that's this restriction — re-uploading the file (which now correctly goes through `raw`) fixes it.

## Contact form setup (optional but recommended)

The Contact section includes a real working form (not just a `mailto:` link). It sends email via [Resend](https://resend.com):

1. Sign up at resend.com (free tier is enough) → API Keys → create one → put it in `.env` as `RESEND_API_KEY`.
2. Leave `CONTACT_FROM_EMAIL` as the default (`onboarding@resend.dev`) to start — it works without any domain setup, but Resend restricts it in some cases (e.g. it may only deliver to the email you signed up with) until you verify your own sending domain in the Resend dashboard. For a portfolio, verifying your own domain (a few DNS records) removes that restriction — see Resend's "Domains" docs.

Messages go to whatever email is set in the admin dashboard's **Site Info → Email** field — there's no separate address to configure. (`CONTACT_TO_EMAIL` in `.env` only exists as a fallback for the rare case that field is empty.)

If `RESEND_API_KEY` is left empty, the form's requests will fail gracefully — visitors see an error asking them to email you directly.

## Admin dashboard

Visit `/admin` (not linked anywhere in the public nav — it's an unlisted route). You'll be prompted for the password you set as `ADMIN_PASSWORD`. Once in, you can edit:

- **Site Info** — name, title, hero headline/description, availability status, email, location, WhatsApp number, social links, **logo** and **favicon** uploads
- **About** — heading, bio paragraphs (add/remove freely), and your **photo** (shown on the homepage hero)
- **Skills** — add/edit/remove, grouped by category, reorder within each category with the up/down arrows
- **Experience** — work history entries with bullet points, add/edit/remove/reorder
- **Projects** — full case studies: title, slug, summary, long-form description, tags, live/repo links, cover image + gallery image uploads, featured flag, add/edit/remove/reorder
- **Resume** — upload a new PDF; it immediately replaces the file served by the public "Download Resume" button

Every change writes straight to Firestore (or Cloudinary, for files) and reflects on the live site instantly (it's reading the same data live, not a cached build) — no redeploy required.

### Admin auth & security model (read this)

There's no full user-account system here — by design, per the original brief, since a single-admin portfolio doesn't need one. Here's exactly how it works and what it does and doesn't protect against:

1. The `/admin` route itself is just an unlisted URL — reaching it proves nothing.
2. Submitting the password calls `/api/admin-login` (a serverless function). It compares your input against `ADMIN_PASSWORD` using a timing-safe comparison, so response timing can't leak the password.
3. On success, that function uses the Firebase **Admin SDK** (your service account) to mint a short-lived Firebase **custom token** carrying `{ admin: true }` as a custom claim.
4. The browser signs into Firebase Auth with that token. From then on, every write to Firestore carries that identity, and every upload request carries that identity's ID token.
5. **The actual security boundary is `firestore.rules` (for data) and `/api/upload-signature.js` (for files), not the React route.** `firestore.rules` checks `request.auth.token.admin == true` before allowing any write. Uploads go through Cloudinary, which has no concept of your Firebase users — so instead, `/api/upload-signature.js` independently re-verifies the caller's Firebase ID token server-side (via the Admin SDK) before it will sign an upload; without a valid signature, Cloudinary itself refuses the upload. Hiding the `/admin` link in the nav is just UX — someone who guesses/finds the URL still can't write anything without passing the password check, because both of these are enforced server-side regardless of what the client does.

**Trade-offs of this approach, deliberately accepted:**
- There's a basic in-memory rate limit on `/api/admin-login` (10 attempts / 5 minutes per IP), but it resets on every cold start and is per-serverless-instance — it raises the cost of brute-forcing the password, it doesn't make it impossible. Use a genuinely long/random password.
- One shared password means no per-user audit trail or revocation — fine for a single-owner site, not fine if multiple people ever need separate access.
- If you ever need real multi-user accounts, roles, or an audit log, that's a sign to move to full Firebase Authentication (email/password or OAuth) instead of this custom-token approach.

This is the simplest approach that still puts the real enforcement in the database's security rules rather than trusting the client — recommended for exactly this project's scope, not for anything with more than one editor.

## SEO

- Semantic HTML throughout (proper heading hierarchy, `<header>`/`<main>`/`<footer>`/`<section>`), descriptive alt text on images.
- Per-page `<title>`, meta description, Open Graph, and Twitter Card tags, updated dynamically per route (`src/components/layout/Seo.jsx`).
- JSON-LD `Person` structured data generated from your live site info (`src/components/layout/PersonSchema.jsx`).
- `robots.txt` (`public/robots.txt`) and a dynamic `sitemap.xml` (`api/sitemap.xml.js`) that includes every project's URL straight from Firestore.
- Custom, on-brand 404 page instead of a generic error.

**Honest caveat:** this is a client-rendered single-page app, not server-rendered. Google's crawler executes JavaScript and can index it reasonably well, but crawlers/scrapers that *don't* execute JS (many social-media link-preview bots, some SEO tools) will only see the static tags baked into `index.html` at build time, not the per-page content swapped in after Firestore loads. If perfect social-preview cards and non-JS-crawler indexing matter a lot to you, the next step up is server-side rendering or a prerendering service — out of scope for this Vite SPA setup.

## Design system notes

- **Fonts:** Instrument Serif (display/headings) + Space Grotesk (body/UI), loaded via Google Fonts in `index.html`. To swap fonts, change the Google Fonts `<link>` in `index.html` and the `--font-display` / `--font-sans` variables in `src/index.css` — nothing else references font names directly.
- **Color/theme:** all colors are CSS custom properties (`--color-bg`, `--color-ink`, `--color-accent`, etc.) defined once in `src/index.css` for dark and light themes, then mapped into Tailwind via `@theme inline`. Change a theme by editing those variables only.
- **Theme toggle:** persists to `localStorage`, respects OS preference on first visit, animates smoothly (no flash — the theme is applied before first paint via an inline script in `index.html`).
- Respects `prefers-reduced-motion` throughout (GSAP reveals, custom cursor, and scroll-bounce all disable themselves).
- **Layout width:** every section's content is capped at 1400px and centered (`src/components/ui/Container.jsx`), matching the nav/footer, so nothing misaligns on ultra-wide screens. Section backgrounds/borders can still span full width since they sit outside the container.
- **Floating WhatsApp button:** appears bottom-right only when a WhatsApp number is set in Site Info; hidden entirely otherwise.

## Deployment (Vercel)

1. Push this repo to GitHub and import it in [vercel.com](https://vercel.com/new).
2. Framework preset: Vite (auto-detected).
3. Add every variable from `.env.example` in the Vercel project's Environment Variables settings (both `VITE_*` client vars and the server-only ones — Vercel injects both into the right place automatically: `VITE_*` at build time into the client bundle, the rest at runtime into `/api` functions).
4. Set `SITE_URL` to your final production domain (used for the sitemap and canonical URLs).
5. Deploy. `vercel.json` already handles SPA routing (all non-`/api` paths rewrite to `index.html`) and the `/sitemap.xml` → `/api/sitemap.xml` rewrite.

The project also runs fine on Netlify with minor changes (an equivalent `netlify.toml` redirect rule instead of `vercel.json`, and moving the `/api` functions to Netlify Functions syntax) — it wasn't set up for both to avoid maintaining duplicate serverless-function code, but nothing in the client code is Vercel-specific.

## Available scripts

```bash
npm run dev       # start the dev server (frontend + /api routes, locally emulated)
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # oxlint
```
