# Phase 6 — HUMAN-ACTION Checklist

Complete these steps after the automated plans finish running.

## 1. Generate SANITY_REVALIDATE_SECRET

```bash
openssl rand -base64 32
```

Copy the output. This is your `SANITY_REVALIDATE_SECRET`.

## 2. Set environment variables in Vercel

Go to Vercel project → Settings → Environment Variables. Add:

| Variable | Value | Environments |
|----------|-------|-------------|
| `SANITY_REVALIDATE_SECRET` | (from step 1) | Production, Preview, Development |
| `SANITY_API_READ_TOKEN` | (from step 3 below) | Production, Preview, Development |
| `SANITY_API_BROWSER_TOKEN` | (optional — same as READ_TOKEN or omit) | Production, Preview |

Note: `NEXT_PUBLIC_VERCEL_URL` is auto-injected by Vercel — do NOT set it manually.

## 3. Create SANITY_API_READ_TOKEN

1. Go to https://manage.sanity.io/projects/zs77se7r/api
2. Click "Add API token"
3. Name: `Next.js Read Token (Phase 6)`
4. Permission: **Editor** (Viewer is insufficient for Draft Mode)
5. Copy the token value → set as `SANITY_API_READ_TOKEN` in Vercel (step 2)

## 4. Configure Sanity webhook

1. Go to https://manage.sanity.io/projects/zs77se7r/api/webhooks
2. Click "Add webhook"
3. Configure:
   - **Name:** `Vercel ISR Revalidation`
   - **URL:** `https://{your-latest-vercel-preview-url}/api/revalidate`
     (Get from Vercel deployments page — use the production or latest preview URL)
   - **HTTP method:** POST
   - **Secret:** paste your `SANITY_REVALIDATE_SECRET` from step 1
   - **Dataset:** `production`
   - **Filter:** `_type in ["post", "siteSettings", "hkSettings", "sgSettings", "venue", "camp", "coach", "faq", "testimonial", "page"]`
   - **Projection:** `{ _type, _id, "slug": slug }`
   - **Enabled:** checked
4. Save

## 5. Configure Sanity Studio user roles

In manage.sanity.io → Project → Members:

| Assign to | Sanity role | Covers |
|-----------|-------------|---------|
| Martin (owner) | Administrator | Full access; 2FA enforced via Google/GitHub |
| Client team (editors — e.g. Monica, Haikel) | Editor | Can publish all document types |
| Blog contributors / coaches | Contributor | Can create + edit drafts; cannot publish |
| Stakeholders | Viewer | Read-only; can use GROQ playground |

2FA is enforced at the Google/GitHub identity provider level — Sanity delegates to OAuth provider.

## 6. Run TypeGen (after env vars are set)

```bash
pnpm typegen
```

Commit the updated `types/sanity.generated.ts`.

Note: typegen currently writes to `sanity.types.ts` at the repo root (Sanity's default output path).
After running, copy the output:

```bash
cp sanity.types.ts types/sanity.generated.ts
git add types/sanity.generated.ts sanity.types.ts
git commit -m "chore(06): regenerate sanity types after env var setup"
```

## 7. Verify end-to-end publish flow

1. In Sanity Studio (http://localhost:3000/studio or Vercel preview /studio):
   - Open "Site Settings" singleton
   - Change the `heroHeading` field value
   - Click "Publish"
2. Within 30 seconds, the root homepage on the Vercel preview should show the updated heading
3. Check browser Network tab: no errors on `/api/revalidate`
4. If the heading does NOT update: check Vercel function logs for the revalidate route

## 8. Verify alt text enforcement

1. In Studio, open any coach document
2. Upload a portrait photo
3. Try to Publish WITHOUT filling in the alt text field
4. Verify: Studio shows validation error "Alt text is required when an image is uploaded."
5. Add alt text → Publish should succeed
