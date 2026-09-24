-- Shared Cloudflare Worker form service. One row per client site.
-- from_email uses Resend's test sender until the client domain is verified.
-- After DNS is verified, update from_email to: hello@client-domain.com
INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
VALUES (
  'vaifoou-construction',
  'Vaifoou Construction',
  'hello@example.com',
  'Vaifoou Construction <onboarding@resend.dev>',
  'Vaifoou Construction',
  '["http://localhost:4321","https://*.vercel.app","https://example.com","https://www.example.com"]'
);
