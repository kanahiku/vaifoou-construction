# Forms Worker — Verification Checklist

Run through this every time you:
- Add a new client site
- Deploy a new version of the worker
- Change any Resend or Cloudflare config
- Suspect emails are going to the wrong place

All `wrangler` commands run from this directory (`services/forms/`).

---

## 1. Worker bindings — no bad globals

```bash
npx wrangler deployments list --name massic-forms
```

Then read what's live:

```bash
npx wrangler secret list --name massic-forms
```

**Pass criteria — check each line:**

| Env var / Secret | Must be | Fail state |
|---|---|---|
| `RESEND_FROM` | **NOT present** in `wrangler.toml [vars]` and NOT set as a secret | If set, every site sends from the same sender name → cross-site mismatch |
| `NOTIFY_EMAIL_OVERRIDE` | **NOT present** anywhere | If set, all sites' leads go to one inbox — catastrophic mismatch |
| `RESEND_DAILY_LIMIT` | `"1000"` (or your agreed cap) | If missing, defaults to 1000 in code |
| `RESEND_API_KEY` | present as a secret starting with `re_` | If absent or placeholder, no emails send |
| `TURNSTILE_SECRET_<SLUG>` | one entry per active site | If missing for a site, that site's form rejects all submissions with "Spam check failed" |

**Quick grep to confirm `RESEND_FROM` and `NOTIFY_EMAIL_OVERRIDE` are not in wrangler.toml:**

```bash
grep -E "RESEND_FROM|NOTIFY_EMAIL_OVERRIDE" wrangler.toml && echo "⚠️  FOUND — remove it" || echo "✅  Clean"
```

---

## 2. D1 sites table — one row per client, nothing shared

```bash
npx wrangler d1 execute massic-forms --remote --command="SELECT slug, name, notify_email, from_email FROM sites ORDER BY slug;"
```

**For every row, verify:**

- [ ] `notify_email` is the client's real inbox (not `@example.com`, not another client's address)
- [ ] `from_email` matches the sending domain verified on Resend  
  - ✅ Verified domain → `hello@theirdomain.com`  
  - ⏳ Not yet verified → `Client Name <onboarding@resend.dev>` is acceptable temporarily  
  - ❌ Wrong site's domain or another client's domain → fix immediately
- [ ] `name` matches the business name exactly as the client expects it in email subjects
- [ ] No two rows share the same `notify_email` (unless intentionally shared and documented)

**Cross-check: no row has a placeholder notify email:**

```bash
npx wrangler d1 execute massic-forms --remote --command="SELECT slug, notify_email FROM sites WHERE notify_email LIKE '%example.com%' OR notify_email LIKE '%placeholder%';"
```
→ Must return 0 rows.

---

## 3. Resend domain verification — confirmed before flipping from_email

For each site that has a custom `from_email` domain (not `onboarding@resend.dev`):

1. Go to [resend.com/domains](https://resend.com/domains)
2. Confirm the domain status is **Verified** (green)
3. Cross-check the D1 `from_email` uses that exact domain

**If a domain shows "Pending" or "Failed" in Resend but D1 has it as `from_email`, emails will bounce or be silently dropped.** Revert that site's `from_email` to `onboarding@resend.dev` until DNS propagates.

---

## 4. Turnstile secrets — one per site

```bash
npx wrangler secret list --name massic-forms
```

Every active site must have exactly one entry: `TURNSTILE_SECRET_<SLUG_UPPERCASE_UNDERSCORED>`

| Site slug | Expected secret name |
|---|---|
| `rc-roofing` | `TURNSTILE_SECRET_RC_ROOFING` |
| `rebellious-aging` | `TURNSTILE_SECRET_REBELLIOUS_AGING` |
| `vaifoou-construction` | `TURNSTILE_SECRET_VAIFOOU_CONSTRUCTION` |
| *(next site)* | `TURNSTILE_SECRET_<SLUG>` |

If a site is missing its secret → all its form submissions return "Spam check failed".  
If the secret value doesn't match the site key used on the frontend → same failure.

**Test Turnstile keys** (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) are acceptable during development but must be replaced before the site goes live to real users.

---

## 5. Lead delivery health check

```bash
npx wrangler d1 execute massic-forms --remote --command="SELECT site_slug, COUNT(*) as total, SUM(CASE WHEN email_sent_at IS NOT NULL THEN 1 ELSE 0 END) as delivered, SUM(CASE WHEN email_sent_at IS NULL THEN 1 ELSE 0 END) as not_delivered FROM leads GROUP BY site_slug ORDER BY site_slug;"
```

**Pass criteria:**
- `not_delivered` should only contain developer test entries (recognisable by `test@example.com`, `(000)0000000`, etc.)
- No real customer names in `not_delivered`

**Inspect undelivered leads in detail:**

```bash
npx wrangler d1 execute massic-forms --remote --command="SELECT id, site_slug, name, email, phone, created_at FROM leads WHERE email_sent_at IS NULL ORDER BY created_at DESC LIMIT 20;"
```

---

## 6. Daily cap — confirm per-site isolation

```bash
npx wrangler d1 execute massic-forms --remote --command="SELECT site_slug, COUNT(*) as sent_today FROM leads WHERE email_sent_at IS NOT NULL AND email_sent_at >= datetime('now','start of day') GROUP BY site_slug;"
```

- Each site has its own counter. Site A hitting 1000 does NOT affect Site B.
- If any site is near the cap and it's a real surge, increase `RESEND_DAILY_LIMIT` in `wrangler.toml` and redeploy.
- Leads are **always saved to D1** even when the cap is hit — no data is lost.

---

## 7. End-to-end smoke test (after any deployment)

Replace `<SLUG>` with the site you want to test.

```bash
curl -s -X POST "https://massic-forms.kanahiku.workers.dev/submit" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:4321" \
  -d '{
    "site": "<SLUG>",
    "name": "Smoke Test",
    "email": "test@example.com",
    "phone": "8085551234",
    "message": "Post-deploy smoke test — safe to ignore.",
    "website": "",
    "turnstileToken": "XXXX.DUMMY.TOKEN.XXXX"
  }'
```

Expected: `{"ok":true}`

The test entry will land in D1 with `email_sent_at: null` (because `test@example.com` is a placeholder and no Resend delivery is attempted). That's correct — the pipeline is working.

---

## 8. Add a new client site — checklist

- [ ] Create Turnstile site at [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/turnstile), copy site key + secret
- [ ] Set frontend env var: `PUBLIC_TURNSTILE_SITE_KEY=<sitekey>` in `.env` and Vercel dashboard
- [ ] Add Turnstile secret to Worker:
  ```bash
  echo "<secret>" | npx wrangler secret put TURNSTILE_SECRET_<SLUG_UPPER> --name massic-forms
  ```
- [ ] Verify sending domain on Resend: [resend.com/domains](https://resend.com/domains)
- [ ] Insert site row in D1:
  ```bash
  npx wrangler d1 execute massic-forms --remote --command="
  INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
  VALUES (
    '<slug>',
    '<Business Name>',
    '<client-notify@theirdomain.com>',
    '<Business Name> <hello@theirdomain.com>',
    '<Business Name>',
    '[\"https://<domain>.com\",\"https://www.<domain>.com\",\"https://*.vercel.app\",\"http://localhost:4321\"]'
  );"
  ```
- [ ] Run smoke test (section 7 above)
- [ ] Confirm lead appears in D1 with correct `site_slug`
- [ ] Confirm notify email arrived in the client's inbox (use a real email in the smoke test, then delete the test lead)

---

## Known safe non-issues

| Thing | Why it's fine |
|---|---|
| `contact_outbox` table in D1 | Legacy schema from an earlier worker version. Empty. Not used by current code. |
| `num_tables: 0` in `wrangler d1 list` | That field is stale cached metadata from the Cloudflare API. The tables definitely exist — use `SELECT name FROM sqlite_master` to verify. |
| `vaifoou-construction` leads with `email_sent_at: null` | Only the smoke test entry. No real customer leads. |
| 4 `rc-roofing` leads with `email_sent_at: null` | All developer tests (Form Wiring Test, Dhruv Garg, Resend Domain Test). No real customers. |
