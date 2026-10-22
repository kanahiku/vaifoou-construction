-- Shared Cloudflare Worker form service. One row per client site.
-- from_email uses Resend's test sender until the client domain is verified.
-- After DNS is verified, update from_email to an approved sender on vaifoouconstruction.com.
INSERT OR REPLACE INTO sites (slug, name, notify_email, from_email, from_name, allowed_origins)
VALUES (
  'vaifoou-construction',
  'Vaifoou Construction',
  'vaifoou4@gmail.com',
  'Vaifoou Construction <onboarding@resend.dev>',
  'Vaifoou Construction',
  '["http://localhost:4321","https://*.vercel.app","https://vaifoouconstruction.com","https://www.vaifoouconstruction.com"]'
);
