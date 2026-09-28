# Switch North Immigration — Project Handoff

Audit date: 2026-09-27  
Repository root inspected: `/home/tamandeep/switchnorth-github/company-website`  
Production domain: `https://switchnorth.ca`

This document describes what exists in the repository at audit time. It does not assume that earlier phase prompts were completed unless the implementation exists in source.

## Executive Summary

Switch North Immigration is a Next.js website for a Canadian immigration consulting business. The production website is deployed on Vercel at `https://switchnorth.ca`. Per current project context, Zoho business email for `info@switchnorth.ca` is configured and the production contact form has been tested successfully.

Current V1 scope is a public marketing and lead-generation site: homepage, about, services, contact form, free assessment form, resources, FAQ, CRS calculator, and interim privacy/terms pages. Public consultation CTAs route to `/contact` while appointment booking is disabled.

Status categories:

- LIVE: public website pages; contact form with server-side validation and Zoho SMTP-capable email workflow; free assessment intake; CRS calculator; resources and FAQ.
- IMPLEMENTED BUT DISABLED: consultation booking route, Stripe checkout/webhook route, appointment management links, admin dashboard routes, payment-triggered agreement email flow.
- PARTIALLY IMPLEMENTED: Google Calendar adapter, reminders, service agreement PDF/email, admin operations, in-memory appointment repository, legal/privacy/terms content, CAPTCHA integration.
- NOT IMPLEMENTED: durable database/ORM, production appointment persistence, real Google Calendar API calls, e-signature/agreement acceptance route, refund automation, background reminder scheduler, production-approved legal agreements, real CAPTCHA verification.

Major unfinished work before enabling booking/payment/admin: connect durable private persistence, replace sample prices/policies, configure/test Stripe live or test mode as appropriate, implement real Google Calendar integration if required, approve agreement wording professionally, harden and test admin in production-like infrastructure, and complete final client/legal content approvals.

## Tech Stack

Actual stack from `package.json` and source:

- Framework: Next.js `16.3.4`, App Router.
- React: `19.3.0` / `react-dom` `19.3.0`.
- Language: TypeScript `5.9.3`.
- Styling: Tailwind CSS `4.3.3`, PostCSS plugin `@tailwindcss/postcss`, global CSS variables in `app/globals.css`.
- Icons: `lucide-react` `1.44.0`.
- Email: `nodemailer` `10.0.11` for SMTP/Zoho; legacy Resend HTTP adapter remains in `lib/email/provider.ts` but Resend dependency is not installed because it uses `fetch`.
- Payments: `stripe` `22.6.2`.
- PDF: `pdfkit` `0.20.2` with `@types/pdfkit`.
- Authentication: custom single-admin HMAC-signed cookie in `lib/admin/auth.ts`; no auth library.
- Database/ORM: none. Appointment, reminder, and audit records use in-memory `globalThis` stores.
- Google APIs: no Google client package. Calendar adapter is a placeholder interface only.
- CAPTCHA: placeholder verifier in `lib/captcha.ts`; no provider package.
- Testing: TypeScript compile via `tsconfig.test.json`, Node built-in test runner, ESLint `9.39.5` with `eslint-config-next`.
- Deployment: Vercel per project context; app code is compatible with Node runtime for contact page and server actions.

## Repository Architecture

Important directories:

- `app/`: Next.js App Router pages, layouts, server actions, route handlers, metadata, sitemap, robots.
- `components/`: layout, UI primitives, section/page components, admin UI, SEO script component.
- `data/`: central site config, feature flags, booking config, service data, assessment options, CRS rules, FAQs, resources, agreement defaults.
- `lib/`: server/domain logic for admin, agreements, assessment/contact validation, booking, calendar placeholder, CRS engine, email, lead workflow, metadata, rate limiting.
- `types/`: TypeScript domain types for site, lead, contact, assessment, booking, agreement, admin, CRS, resources.
- `tests/`: Node tests for admin, agreement, booking availability/payment, contact email, CRS engine.
- `public/`: logo and hero image assets.
- `docs/`: agreement review checklist and Vercel/Zoho email environment setup.

Important submodules:

- `lib/email/`: provider abstraction and HTML/text templates.
- `lib/booking/`: availability, in-memory repository, Stripe checkout/webhook support, lifecycle/reschedule/cancel/reminders, timezone helpers.
- `lib/agreement/`: service agreement data generation, PDF rendering, template sections, email workflow.
- `lib/admin/`: admin auth, audit log, API response helper, admin service/actions.
- `components/sections/`: page-level reusable experiences including contact form, assessment form, CRS calculator, booking form, service/article layouts.

## Route Inventory

| Route | Purpose | Public/Admin | Current Status | Feature Flag | Production Exposure |
| --- | --- | --- | --- | --- | --- |
| `/` | Homepage marketing and CTAs | Public | LIVE | none | Public, static |
| `/about` | Business/about page | Public | LIVE with conservative credential-confirmation wording | none | Public, static |
| `/services` | Services landing | Public | LIVE | none | Public, static |
| `/services/[slug]` | Individual service pages from `siteConfig.serviceCategories` | Public | LIVE | none | Public, SSG |
| `/contact` | Contact page and form | Public | LIVE | none | Public, dynamic because server action/email runtime |
| `/assessment` | Multi-step free assessment lead form | Public | LIVE | none | Public, static page plus server action |
| `/tools/crs-calculator` | Express Entry CRS calculator | Public | LIVE | none | Public, static/client component |
| `/resources` | Resource/category landing | Public | LIVE with general guide articles | none | Public, static |
| `/resources/[slug]` | Article pages from `data/resources.ts` | Public | LIVE, general-information content | none | Public, SSG |
| `/faq` | FAQ page with structured data | Public | LIVE | none | Public, static |
| `/privacy` | Privacy information page | Public | LIVE interim content, needs legal review | none | Public, static |
| `/terms` | Terms/disclaimer page | Public | LIVE interim content, needs legal review | none | Public, static |
| `/consultation` | Appointment booking flow | Public/future | DISABLED | `FEATURE_APPOINTMENTS` / `NEXT_PUBLIC_FEATURE_APPOINTMENTS` | Redirects to `/contact` via `app/consultation/layout.tsx` when disabled |
| `/consultation/confirmation` | Payment/appointment confirmation page | Public/future | DISABLED with parent layout | `FEATURE_APPOINTMENTS` | Redirects to `/contact` when disabled |
| `/appointment/manage/[token]` | Client self-service reschedule/cancel | Public token route/future | DISABLED | `FEATURE_APPOINTMENT_MANAGEMENT` | `notFound()` via `app/appointment/layout.tsx` when disabled |
| `/admin` | Admin dashboard | Admin/future | DISABLED | `FEATURE_ADMIN_PORTAL` | `notFound()` via `app/admin/layout.tsx` when disabled |
| `/admin/login` | Admin login | Admin/future | DISABLED by layout/action | `FEATURE_ADMIN_PORTAL` | Under admin layout; action returns disabled error if somehow invoked |
| `/admin/appointments` | Admin appointment list | Admin/future | DISABLED | `FEATURE_ADMIN_PORTAL` | `notFound()` via layout |
| `/admin/appointments/[id]` | Admin appointment detail/actions | Admin/future | DISABLED | `FEATURE_ADMIN_PORTAL` | `notFound()` via layout |
| `/admin/clients` | Admin client index | Admin/future | DISABLED | `FEATURE_ADMIN_PORTAL` | `notFound()` via layout |
| `/admin/clients/[id]` | Admin client detail | Admin/future | DISABLED | `FEATURE_ADMIN_PORTAL` | `notFound()` via layout |
| `/admin/api/appointments` | Admin appointment JSON API | Admin/internal future | DISABLED | `FEATURE_ADMIN_PORTAL` | Route handler returns 404 when disabled |
| `/api/stripe/webhook` | Stripe webhook | Internal/future | DISABLED | `FEATURE_PAYMENTS` | Returns 404 when payments disabled |
| `/robots.txt` | Robots policy | Public | LIVE | none | Disallows `/admin/`, `/api/`, `/appointment/`, `/consultation/` |
| `/sitemap.xml` | Sitemap | Public | LIVE | `FEATURE_APPOINTMENTS` only for consultation inclusion | Disabled routes omitted by default |

No agreement review/acceptance route exists in `app/`. There is no public `/agreement` or `/agreements` route.

## V1 Production Website

A production visitor can currently:

- Browse homepage, about, service landing/detail pages, resources/articles, FAQ, interim privacy/terms pages, and CRS calculator.
- Submit `/contact` form. The server validates input, rate limits, sends business notification, sends acknowledgement, and returns success only after accepted delivery.
- Submit `/assessment` form. It validates and sends through the same lead workflow; no database persistence.
- Use CTAs labeled “Book a Consultation”, but with default feature flags they resolve to `/contact` through `siteConfig.bookingUrl`.

Navigation and footer use `siteConfig.navigation` and `siteConfig.bookingUrl`. Service pages, homepage, about, FAQ, resources, contact, CRS sections all use the central booking URL for primary consultation CTA. I did not find accidental public CTAs from enabled pages directly linking to `/consultation`; hardcoded `/consultation` links exist inside disabled consultation pages and Stripe URL generation only.

V1 caveats:

- `/privacy` and `/terms` have conservative V1 interim content, but are not final reviewed legal policies.
- Public credential wording is intentionally conservative until consultant credentials and regulator wording are confirmed.
- Resource articles are general planning guides and should be reviewed/approved before being treated as final authored advice.
- No social links are displayed until real profile URLs are supplied.
- Structured data avoids address details but uses current phone/email/domain.

## Feature Flags

Central file: `data/features.ts`.

| Flag | Environment Variable | Default | Production Intention | Controls |
| --- | --- | --- | --- | --- |
| `featureFlags.appointments` | `FEATURE_APPOINTMENTS` or fallback `NEXT_PUBLIC_FEATURE_APPOINTMENTS` | `false` | Keep false for V1 | `siteConfig.bookingUrl`, consultation layout redirect, sitemap inclusion of `/consultation`, booking action guard |
| `featureFlags.payments` | `FEATURE_PAYMENTS` | `false` | Keep false for V1 | `/api/stripe/webhook` returns 404 unless true; agreement send in webhook only possible after payments enabled |
| `featureFlags.agreementPortal` | `FEATURE_AGREEMENT_PORTAL` | `false` | Keep false for V1 | Payment webhook only generates/sends service agreement if true |
| `featureFlags.adminPortal` | `FEATURE_ADMIN_PORTAL` | `false` | Keep false for V1 | Admin layout 404, admin login/action guards, admin API 404 |
| `featureFlags.appointmentManagement` | `FEATURE_APPOINTMENT_MANAGEMENT` | `false` | Keep false for V1 | Client appointment management layout 404 and action redirects |

Server-side enforcement exists for disabled routes/APIs; this is not navigation-only hiding. `robots.ts` also disallows disabled namespaces, but robots is not the security mechanism.

## Contact + Zoho Email

Current contact address: `info@switchnorth.ca` in `data/site.ts`.

Workflow:

1. `components/sections/contact-form.tsx` posts to server action `app/contact/actions.ts`.
2. Honeypot field `company` is checked.
3. `lib/contact-validation.ts` validates name, email, optional phone, country, interest, message, consent, header injection, and spammy repeated URLs.
4. `lib/captcha.ts` checks CAPTCHA only if `CAPTCHA_SECRET_KEY` exists. Important: if `CAPTCHA_SECRET_KEY` is set today, verifier returns `{ configured: true, valid: false }`, so forms will fail until a real provider is implemented.
5. `lib/rate-limit.ts` hashes IP/user-agent/fallback and enforces in-memory rate limit of 5 contact attempts per 15 minutes.
6. `lib/lead-workflow.ts` creates notification and acknowledgement emails.
7. `lib/email/provider.ts` sends with configured provider. For V1 production use `EMAIL_PROVIDER=zoho` or `smtp`; Nodemailer SMTP requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`.
8. Business notification goes from authenticated `EMAIL_FROM` to `CONTACT_RECIPIENT`; `Reply-To` is the visitor email. The visitor never controls From/To.
9. Visitor acknowledgement is sent after business notification. If acknowledgement fails but business notification succeeds, workflow still returns success and logs only a safe warning.

Failure behavior:

- Business notification failure causes user-facing retry error.
- Acknowledgement-only failure does not fail the inquiry.
- In production with `EMAIL_PROVIDER=disabled`, `sendEmail` throws “Email delivery is not configured.”
- No contact/assessment submission data is stored in a database.

Relevant env vars:

- `EMAIL_PROVIDER`, `EMAIL_FROM`, `CONTACT_RECIPIENT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`.
- Legacy/optional: `LEAD_NOTIFICATION_TO`, `RESEND_API_KEY`.
- Docs: `docs/VERCEL_ZOHO_EMAIL_SETUP.md`.

Security notes:

- Email template HTML escapes user content.
- Provider rejects CRLF in header values.
- Contact tests cover Reply-To, acknowledgement failure, SMTP/header injection, validation, honeypot, and HTML escaping.

## Appointment System

Overall status: IMPLEMENTED BUT DISABLED / PARTIAL. The UI and domain logic exist, but production-safe persistence, payment configuration, real calendar integration, final policies, and feature flags are not ready for live booking.

Components:

| Component | Status | Notes |
| --- | --- | --- |
| `/consultation` page | DISABLED | Redirects to `/contact` unless appointments flag is true. |
| Booking form UI | PARTIAL | Multi-step form exists in `components/sections/booking-form.tsx`; sample prices and disabled payment handoff messaging remain. |
| Consultation types/pricing | PARTIAL | `data/booking.ts` contains sample 30/60 minute sessions and sample prices. Must be replaced/approved. |
| Availability | COMPLETE for local logic | Business hours, horizon, minimum notice, blocked times, unavailable dates, overlap checks, timezone string. Uses sample blocked/unavailable data. |
| Appointment persistence | MISSING for production | `lib/booking/repository.ts` uses `globalThis` arrays only. Data is lost across server restarts/functions and not shared reliably in serverless. |
| Pending-payment hold | PARTIAL | Holds exist in memory with `PENDING_PAYMENT`, `PAYMENT_REQUIRED`, `holdExpiresAt`; expired holds are released when repository list/find methods run. |
| Overlap prevention | PARTIAL | In-memory create rejects overlapping active appointments. Needs DB transaction/constraint for production. |
| Statuses | IMPLEMENTED | `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`; payment statuses include pending/paid/failed/expired/refunded variants. |
| Timezone handling | PARTIAL | `America/Vancouver`, `Intl.DateTimeFormat`, helper functions. Needs production review for DST/calendar correctness. |
| Secure management tokens | PARTIAL | Random base64url token, SHA-256 hash stored on appointment. No durable storage. |
| Rescheduling | IMPLEMENTED BUT DISABLED | Client route/action exists; admin service has status actions but no admin reschedule UI action currently visible. Calendar update is placeholder. |
| Cancellation | IMPLEMENTED BUT DISABLED | Client route/action and admin cancel action exist; refund is not automated. |
| Reminders | PARTIAL | Schedules reminder records and `sendDueAppointmentReminders()` exists. No cron/background job wired in Vercel. |
| Admin actions | IMPLEMENTED BUT DISABLED | Confirm, cancel, complete, no-show, resend confirmation, resend agreement. |

What prevents safe enablement:

- No durable production database or migrations.
- No transactional slot locking.
- Stripe feature disabled and likely not production-configured in source.
- Google Calendar adapter does not call Google APIs.
- Sample prices, blocked dates, policies, cancellation/refund wording.
- Reminder scheduler is not wired to a Vercel Cron or queue.
- Admin portal is disabled and depends on in-memory repository/audit log.

## Google Calendar

Status: PARTIALLY IMPLEMENTED placeholder, not production-integrated.

`lib/calendar/google.ts` defines `CalendarAdapter` with `updateAppointment` and `cancelAppointment`. It checks only `GOOGLE_CALENDAR_ID` and `GOOGLE_SERVICE_ACCOUNT_EMAIL`. The `.env.example` also includes `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, but code does not use it.

Current behavior:

- If not configured, adapter returns `status: "PENDING"` and message “Google Calendar is not configured.”
- If configured, adapter still returns `status: "PENDING"` and message saying provider API wiring should update/delete the event here.
- No event creation method exists. Booking creation only sets `calendarSyncStatus: "PENDING"`.
- Reschedule/cancel lifecycle calls adapter and records calendar sync result; failures create audit entries.
- No retry job exists except failed status/audit tracking.

Production configured/tested: not provable from repository. No Google client dependency exists, so actual event creation/update/cancel is not implemented.

## Stripe / Payments

Status distinction:

- IMPLEMENTED: Stripe Checkout session creation, webhook verification, payment event processing, status updates, duplicate-event tracking, payment failure/expiry handling, tests.
- CONFIGURED: cannot be confirmed from repo; `.env.example` has empty Stripe vars and real secrets were not inspected.
- TESTED: automated tests exist with mocked/test event objects and Stripe webhook signature helper.
- LIVE: disabled by `FEATURE_PAYMENTS=false` default and webhook returns 404 when disabled.

Implementation details:

- `lib/booking/stripe.ts` creates Checkout Sessions with appointment metadata and success/cancel URLs.
- `app/api/stripe/webhook/route.ts` requires `FEATURE_PAYMENTS=true`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- Webhook signature is verified with `stripe.webhooks.constructEvent`.
- `lib/booking/payment-events.ts` handles:
  - `checkout.session.completed` with `payment_status === "paid"` -> mark appointment `CONFIRMED`/`PAID`.
  - `checkout.session.expired` -> mark `CANCELLED`/`EXPIRED`.
  - `checkout.session.async_payment_failed` and `payment_intent.payment_failed` -> mark `CANCELLED`/`FAILED`.
  - duplicate event IDs -> ignored idempotently.
- On successful payment, webhook schedules reminders and conditionally sends agreement if `FEATURE_AGREEMENT_PORTAL=true`.
- Refund support is not automated. Types include refund statuses; admin UI says refunds are separate business operations.

## Agreement System

Overall status: PARTIALLY IMPLEMENTED / future-ready, not production-approved, disabled in V1.

Implemented:

- `data/agreement.ts` version/defaults and review-required list.
- `lib/agreement/template.ts` generates numbered sections, initials markers, placeholders, and validation.
- `lib/agreement/generator.ts` creates service agreement PDF with logo/header/footer, sections, timeline, fee milestones, signature blocks.
- `lib/agreement/workflow.ts` generates and emails PDF attachment to client and optional business notification, then records `agreementId`, version, generated/sent timestamps, delivery status on appointment.
- Admin can resend/regenerate agreement email for paid confirmed appointments.
- Tests cover data replacement, validation, PDF generation, payment-triggered agreement email, idempotency.

Not implemented:

- Agreement storage beyond appointment metadata; PDF is generated and emailed, not stored durably.
- PDF hash/integrity record.
- Secure review links or portal.
- Online initials/acceptance/signature workflow.
- Licensee signature workflow.
- Void/replacement lifecycle beyond resend/regenerate email.
- Agreement acceptance route/API.
- Durable audit trail for agreements.

Production blockers:

- `docs/AGREEMENT_REVIEW_CHECKLIST.md` explicitly says not approved production legal wording.
- Default tax, processing time, payment/refund/legal terms are placeholders.
- Electronic signing not implemented; template says signature and initials are placeholders.
- `FEATURE_AGREEMENT_PORTAL` defaults false.

## Admin Dashboard

Overall status: IMPLEMENTED BUT DISABLED / not production-ready.

Implemented:

- Single admin login with custom signed HttpOnly cookie scoped to `/admin`.
- Production requires `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- `/admin` dashboard metrics, today/upcoming appointments, recent payments, audit log.
- `/admin/appointments` filters by search/date/status/payment.
- `/admin/appointments/[id]` appointment detail with client, appointment, payment, calendar, agreement/email data.
- `/admin/clients` and `/admin/clients/[id]` client grouping from appointments.
- Admin actions: confirm manually, cancel, complete, no-show, resend confirmation, resend agreement.
- Internal API `/admin/api/appointments` returns sanitized appointment list when authorized.

Disabled/exposure:

- `app/admin/layout.tsx` calls `notFound()` unless `FEATURE_ADMIN_PORTAL=true`.
- Login action returns disabled error unless flag enabled.
- Admin API returns 404 unless flag enabled.

Security gaps before enabling:

- No durable database; admin sees only in-memory records.
- No rate limiting on admin login visible in source.
- No MFA, password rotation UI, roles, or staff management.
- Audit log is in-memory and lost on restart.
- Admin action CSRF relies on same-site cookies and server actions; no explicit CSRF token.
- Admin can manually confirm without verified payment; intentional but should be operationally controlled.

## Data Model and Persistence

Database technology: none. No ORM, migrations, schema files, or database client exist.

Persistence strategy:

- Contact/assessment leads: emailed only; not stored.
- Appointments: `globalThis.switchNorthAppointments` in memory.
- Reminders: `globalThis.switchNorthAppointmentReminders` in memory.
- Audit entries: `globalThis.switchNorthAdminAuditLog` in memory.
- Agreements: PDF generated in memory and attached to email; only metadata written to in-memory appointment record.

Major entities from actual types:

- `ContactLead`: fullName, email, phone, country, interest, message, consent.
- `AssessmentFormData`: personal, goal, education, work, language, Canada connections, message, consent.
- `BookingClientDetails`: contact/interest/preferred language/situation/consent.
- `AppointmentRecord`: id, consultation type, date/time/timezone, appointment status, payment status, Stripe IDs, calendar fields, confirmation fields, management token hashes, payment timestamps, refund status, processed Stripe event IDs, agreement metadata, hold expiry, client details.
- `AppointmentReminderRecord`: reminder id, appointment id, type, scheduled time, status, failure/sent metadata.
- `AuditEntry`: action, admin id, entity, entity id, timestamp.
- `ServiceAgreementData`: generated agreement document fields.

When DB configuration is absent in V1: nothing reads `DATABASE_URL`; public V1 still works because contact/assessment are email-only. Booking/admin future code is not production-persistent.

## External Services

| Service | Purpose | Implemented | Configured | Production Active |
| --- | --- | --- | --- | --- |
| Vercel | Hosting/deployment | Yes | Per project context, yes | Yes |
| Zoho Mail SMTP | Contact/assessment email delivery | Yes via Nodemailer SMTP | Per project context, yes | Contact form reported tested in production |
| Stripe | Checkout and webhook for appointment payments | Yes in code | Unknown from repo | No, `FEATURE_PAYMENTS` defaults false |
| Google Calendar | Appointment calendar sync | Placeholder only | Unknown from repo | No actual API integration |
| Database | Durable appointments/admin/agreement persistence | No | No | No |
| Storage | Agreement PDF storage | No | No | No |
| CAPTCHA | Spam protection | Placeholder only | Should remain unset unless implemented | No |
| Resend | Alternate email provider | Legacy code path | Unknown; no dependency needed | Not intended for V1 Zoho |

## Environment Variable Inventory

V1 required:

- `NEXT_PUBLIC_SITE_URL`: public canonical/deployment URL.
- `EMAIL_PROVIDER`: `zoho` in production, `disabled` locally.
- `EMAIL_FROM`: authenticated sender identity.
- `CONTACT_RECIPIENT`: notification inbox.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`: Zoho SMTP configuration.

Optional:

- `CAPTCHA_SECRET_KEY`: reserved. Do not set until real verifier is implemented because current verifier fails when configured.
- `LEAD_NOTIFICATION_TO`: legacy recipient fallback; `CONTACT_RECIPIENT` takes precedence.
- `RESEND_API_KEY`: only if using `EMAIL_PROVIDER=resend`.

Booking/future:

- `NEXT_PUBLIC_FEATURE_APPOINTMENTS`, `FEATURE_APPOINTMENTS`, `FEATURE_APPOINTMENT_MANAGEMENT`.

Payment:

- `FEATURE_PAYMENTS`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- `SITE_URL` is referenced in `lib/booking/stripe.ts` but missing from `.env.example`; `NEXT_PUBLIC_SITE_URL` is documented and works as fallback.

Google:

- `GOOGLE_CALENDAR_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` appears in `.env.example` but is not read by current code.

Database:

- `DATABASE_URL` appears in `.env.example` and README as future, but is not referenced by code.

Agreements:

- `FEATURE_AGREEMENT_PORTAL`; agreement email uses same email provider vars.

Admin:

- `FEATURE_ADMIN_PORTAL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.

Implicit/platform:

- `NODE_ENV` controls production behavior in email provider, Stripe setup, admin defaults, secure cookies.

Missing from `.env.example` but referenced:

- `SITE_URL`.

Unused/legacy in `.env.example`:

- `DATABASE_URL` currently unused.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` currently unused.
- `LEAD_NOTIFICATION_TO` legacy fallback.

## SEO / Production Domain

- `siteConfig.domain` is `https://switchnorth.ca`.
- Root metadata uses `metadataBase: new URL(siteConfig.domain)`.
- `createPageMetadata()` builds canonical and OpenGraph URLs from `siteConfig.domain`.
- Sitemap uses `siteConfig.domain` and omits `/consultation` unless appointments flag enabled.
- Robots allows `/`, disallows `/admin/`, `/api/`, `/appointment/`, `/consultation/`.
- Organization/ProfessionalService structured data exists in `components/seo/site-structured-data.tsx` with conservative fields.
- Contact page includes ProfessionalService structured data with country-only postal address while address is not full/final.
- FAQ page emits FAQPage structured data.
- Resource detail pages emit Article structured data.
- Assets: logo at `public/assets/images/logo.jpeg`, hero/OpenGraph image at `public/images/consultation-hero.png`.
- No `manifest.ts` or web app manifest file found.
- No Vercel preview or localhost canonical URLs found in source scan.

SEO/content issues:

- Privacy and terms are V1 interim pages and still need professional/legal review.
- Resource articles are general planning content and still need content approval.
- Public demo/placeholder credential language was removed in Phase 16A.
- Public pages no longer mention `DEMO-RCIC-000000`; credential display remains conservative until the current credential value and regulator wording are confirmed.

## Security Review

Findings are practical and current-state based.

CRITICAL:

- None found in enabled V1 code from source inspection.

HIGH:

- Future booking/admin systems use in-memory persistence only. Enabling them in production would lose records and break consistency across serverless instances.
- Admin portal lacks login rate limiting/MFA and uses single shared credentials. Keep disabled until hardened.
- Agreement template and legal/policy text are explicitly not production-approved. Do not enable agreement delivery as a formal workflow without professional approval.

MEDIUM:

- Public content uses conservative credential-confirmation wording and does not publish the unverified licence value as a visitor-facing claim.
- CAPTCHA env is dangerous to set prematurely: current verifier rejects all submissions if configured.
- Booking validation does not include the same CRLF/header-injection hardening as contact validation; disabled today, but should be hardened before enabling booking emails.
- Stripe/admin routes are built into the app, but guarded by flags. Misconfigured flags could expose incomplete systems.
- Google Calendar env private key is documented but not used, which may mislead deployment setup.

LOW:

- Footer no longer displays development credential messaging.
- Social links are hidden until real URLs are configured.
- `SITE_URL` is referenced but not documented in `.env.example`.
- Rate limiting is in-memory only; adequate as lightweight friction, not distributed protection.
- Contact honeypot now returns an error, while assessment honeypot returns success; inconsistent anti-spam UX.

Positive security controls:

- Secrets are server-side env vars; no `NEXT_PUBLIC_` secret use found.
- Stripe webhook verifies signatures and does not trust redirects.
- Email provider prevents header injection and escapes HTML template values.
- Disabled routes are enforced server-side by layouts/actions/route handlers.
- Appointment management tokens are random and stored hashed.
- Admin cookies are HttpOnly, SameSite strict, secure in production.
- No card data is stored.

## Testing

Validation commands run during this audit:

- `npm run lint`: passed.
- `npm test`: passed, 33 tests.
- `npm run build`: see final validation section below after this document is written.

Current test files:

- `tests/contact-email.test.ts`: contact validation, honeypot, Reply-To, notification/ack failure strategy, header injection, HTML escaping.
- `tests/booking-payment.test.ts`: Stripe payment success/failure/duplicate/expired/invalid signature.
- `tests/booking-availability.test.ts`: slot overlap, cancelled appointment behavior, minimum notice/unavailable dates.
- `tests/agreement.test.ts`: agreement data, validation, PDF generation, workflow idempotency.
- `tests/admin.test.ts`: admin auth/session, authorization, API, status changes, resend confirmation/agreement.
- `tests/crs-engine.test.ts`: CRS score boundary/cap/additional points.

Important gaps:

- No end-to-end/browser tests for public navigation/forms.
- No tests for sitemap/robots feature gating.
- No tests for consultation layout redirect/admin layout 404 guards.
- No production SMTP integration test; tests mock delivery.
- No tests for assessment form server action and acknowledgement-only failure behavior.
- No tests for actual Google Calendar API because it is not implemented.
- No tests for reminder scheduler invocation/cron.
- No tests for admin login rate limiting because none exists.
- No accessibility/visual regression tests.

## Technical Debt

P0:

- Do not enable booking/payment/admin without durable database, transactional slot locking, and production storage strategy.
- Keep public credential wording conservative until consultant credentials and regulator wording are confirmed.

P1:

- Replace V1 interim privacy and terms pages with professionally reviewed legal content.
- Review and approve general resource articles, or replace them with final authored content.
- Finish or remove agreement workflow from production path until approved.
- Harden admin login (rate limiting, MFA or stronger auth option, credential rotation, durable audit log).
- Implement real Google Calendar integration or remove the env/docs expectation.

P2:

- Document or remove `SITE_URL`; remove/clarify unused `DATABASE_URL` and Google private key until used.
- Harmonize contact and assessment spam/honeypot behavior.
- Add tests for route feature guards, assessment lead workflow, and SEO outputs.
- Replace sample booking prices/blocked dates/policies.
- Add distributed rate limiting if forms receive spam in production.

P3:

- Add real social profile URLs if the business wants social links displayed.
- Add manifest/favicon audit if desired.
- Clean old README sections that describe future systems in detail once `HANDOFF.md` becomes authoritative.
- Consider splitting future booking/admin code from V1 public build if deployment clarity becomes more important than code preservation.

## Client Information Still Needed

Items still missing/placeholder or requiring approval in repository:

- Confirm consultant legal name, title, CICC/RCIC credential wording, and whether `R1054070` is final/verified.
- Confirm whether/how the current credential value in `data/site.ts` should be displayed publicly.
- Final physical office address and whether a real map embed should be enabled.
- Confirm phone number `+1 (778) 957-3512` and business hours.
- Real social profile URLs.
- Final privacy policy and terms/disclaimer.
- Final service descriptions/articles if the current general guide content is not sufficient.
- Consultation types, durations, prices, taxes, refund/cancellation/rescheduling policies.
- Stripe account/test/live mode plan and webhook endpoint setup.
- Google Calendar account/service-account setup and whether calendar sync is required.
- Service agreement wording, governing province, CICC references, complaint process, fee/refund terms, signature process, storage/retention policy.
- Admin user/security policy and audit retention policy.


## Phase 16A Production Cleanup — 2026-09-27

Scope completed for V1 public production cleanup:

- Removed public-facing demo/development credential language from homepage, about page, footer, FAQ, contact location copy, resources, article pages, privacy, and terms.
- Stopped publishing the unverified licence number in visitor-facing homepage/about/footer content. Public copy now tells users to confirm professional credentials directly with the consultant and appropriate regulator before retaining services.
- Kept business data centralized in `data/site.ts`; renamed the internal site flag to `requiresClientConfirmation` and kept a source-code comment requiring confirmation of credentials, address, hours, languages, and social profiles before using them for regulated claims or local SEO.
- Removed the placeholder social `#` link from central config. Footer now hides social links when none are configured.
- Reworked resource pages from “sample articles” to “general guides” with current-requirements disclaimers and official-source linking. The internal resource architecture remains CMS/MDX-ready.
- Replaced privacy and terms scaffolds with conservative V1 interim pages. They are presentable but still require professional/legal review before being treated as final policies.
- Made contact and assessment fallback success messages production-safe if email delivery is disabled or mocked.
- Confirmed `siteConfig.bookingUrl` still resolves through feature flags; with appointment flags disabled, public consultation CTAs resolve to `/contact`.
- Confirmed sitemap/robots continue to omit or disallow disabled future routes by default.

Files changed in Phase 16A:

- `app/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/resources/page.tsx`
- `app/contact/actions.ts`
- `app/assessment/actions.ts`
- `components/layout/footer.tsx`
- `components/sections/article-page-layout.tsx`
- `components/seo/site-structured-data.tsx`
- `data/faqs.ts`
- `data/resources.ts`
- `data/site.ts`
- `types/resources.ts`
- `types/site.ts`
- `docs/HANDOFF.md`

Deliberate decisions:

- Booking, payments, appointment management, admin, agreement, and calendar systems remain disabled and were not enabled or re-architected. Disabled future files still contain sample pricing/policy/template language by design.
- The exact consultant credential and public regulator wording were not invented or verified. The site avoids presenting the current licence value as a verified public claim.
- The Surrey office location remains broad and structured data remains conservative; no precise address or map pin was added.
- Resource articles remain general planning content, not current-law advice or final authoritative guides.
- No fake testimonials, reviews, ratings, approval rates, awards, case numbers, government affiliation, or success statistics were added.

Remaining client/professional confirmation needed:

- Confirm consultant legal name, title, credential number, regulator wording, and whether/how it should be displayed publicly.
- Confirm final phone, public office address, business hours, languages, service areas, and social profiles.
- Approve privacy policy, terms/disclaimer, resource content, and local SEO data before treating those pages as final legal/content assets.
- Keep `FEATURE_APPOINTMENTS`, `FEATURE_PAYMENTS`, `FEATURE_ADMIN_PORTAL`, `FEATURE_AGREEMENT_PORTAL`, and `FEATURE_APPOINTMENT_MANAGEMENT` false for V1 unless the future systems are completed and production-tested.

Phase 16A placeholder scan notes:

- Live public surfaces were scanned for `demo`, `placeholder`, `development`, `sample`, `DEMO-RCIC`, `example`, `coming soon`, and `href="#"`. Remaining hits are internal form placeholder props, fallback scaffold components not rendered by V1 privacy/terms pages, or disabled future booking/agreement modules.
- Disabled booking/agreement files still intentionally contain sample development data because those systems are out of V1 public scope and feature-flagged off.


## Phase 16B UI/UX Production Polish — 2026-09-27

Scope completed for the V1 public UI/UX consistency pass:

- Preserved the existing Switch North visual identity and brand palette; no wholesale redesign or new business functionality was added.
- Tightened shared form styling with clearer focus, invalid, hover, and error states across contact, assessment, and CRS calculator controls.
- Added visible required/optional indicators to contact and assessment forms without changing server-side validation behavior.
- Improved contact and assessment consent checkbox focus treatment and kept privacy/terms links keyboard-focusable.
- Added an accessible assessment progress bar label/value and reduced the assessment step heading size so the form feels less oversized inside its card.
- Improved CRS calculator usability with clearer CLB/NCLC language labels, numeric input hints for age, live score announcements, and alert semantics for invalid estimates.
- Made mobile navigation scroll within the viewport and normalized mobile menu text sizing.
- Re-enabled a restrained footer general-information disclaimer and added focus-visible styling to footer links.
- Added reduced-motion CSS support and anchor scroll offsets for sticky-header jump links.
- Constrained article body width for better long-form readability on desktop.
- Kept future booking, payment, admin, agreement, database, Stripe, and calendar systems untouched and disabled.

Files changed in Phase 16B:

- `app/globals.css`
- `components/ui/button.tsx`
- `components/ui/form-styles.ts`
- `components/layout/header.tsx`
- `components/layout/footer.tsx`
- `components/sections/contact-form.tsx`
- `components/sections/assessment-form.tsx`
- `components/sections/crs-calculator.tsx`
- `components/sections/article-page-layout.tsx`
- `docs/HANDOFF.md`

Responsive review notes:

- Mobile widths around 375px and 390px were addressed through button wrapping, full-width form submit buttons, mobile menu scroll containment, and reduced mobile menu typography.
- Tablet/desktop readability was improved through article measure limits, maintained page/header clamps, and restrained section/form heading sizes.
- No new heavy dependencies or client-only visual systems were added.

Remaining design/content concerns:

- Final privacy, terms, credential wording, resource content, social profiles, and local SEO details still need client/professional approval.
- Visual browser screenshots were not added because the project does not include browser/visual regression tooling; validation used source review plus lint/test/build.
- Disabled future booking/admin/payment screens were not polished as public V1 surfaces.

## Phase 16 — V1 Production Baseline

Baseline status after Phases 16A, 16B, and 16C: READY for continued V1 public production use, subject to the remaining client/legal/content decisions listed below. No Phase 17 database/backend work has been started.

Public V1 routes to preserve:

- `/`
- `/about`
- `/services` and `/services/[slug]`
- `/contact`
- `/assessment`
- `/tools/crs-calculator`
- `/resources` and `/resources/[slug]`
- `/faq`
- `/privacy`
- `/terms`
- `/robots.txt`
- `/sitemap.xml`

Production baseline findings:

- Public navigation and footer use central `siteConfig` navigation/service data.
- Public consultation CTAs use `siteConfig.bookingUrl`; with appointment flags disabled this resolves to `/contact`.
- Header and footer do not expose disabled booking/payment/admin routes.
- Contact and assessment forms use server actions, honeypots, server-side validation, in-memory rate limiting, and the shared email workflow. No database persistence is used for V1 leads.
- Zoho/SMTP email architecture is server-side only. Visitor email is used as `Reply-To`, never as the sender. Email HTML escapes submitted content and header values are checked for CRLF injection.
- CRS calculator remains informational, uses centralized rules/config, and states that IRCC determines official scores.
- Resource and FAQ content remains general and evergreen; no fabricated testimonials, reviews, ratings, approval rates, case numbers, awards, government affiliation, or success statistics were found.
- Privacy and terms pages are presentable V1 interim pages, but not final reviewed legal policies.
- Production domain, metadata base, canonical URLs, Open Graph, Twitter metadata, sitemap, robots, FAQ schema, Article schema, and conservative Organization/ProfessionalService structured data are in place.
- Sitemap includes only public V1 routes plus service/resource pages unless `FEATURE_APPOINTMENTS` is enabled. Robots disallows `/admin/`, `/api/`, `/appointment/`, and `/consultation/`.
- Structured data intentionally avoids exact address and unverified credential claims.
- Responsive and accessibility basics are in good V1 condition after Phase 16B: focus states, mobile navigation containment, form labels/errors, reduced-motion handling, skip link, semantic headings, and readable article measure are present.
- Public-surface scans did not find remaining old `DEMO-RCIC`, public demo credential copy, public `href="#"` social links, or accidental enabled links to disabled systems. Remaining `placeholder`/`development` strings are internal prop names, disabled-provider status strings, tests, or disabled future modules.
- Tracked-file secret scan found no production source secret literals. Matches were test fixtures only. Real secrets must remain in Vercel/environment variables and must not be committed or printed.

Feature-flag state to preserve for V1:

- `NEXT_PUBLIC_FEATURE_APPOINTMENTS=false`
- `FEATURE_APPOINTMENTS=false`
- `FEATURE_PAYMENTS=false`
- `FEATURE_AGREEMENT_PORTAL=false`
- `FEATURE_ADMIN_PORTAL=false`
- `FEATURE_APPOINTMENT_MANAGEMENT=false`

Disabled systems that must remain off until intentionally completed:

- Appointment booking and appointment management.
- Stripe Checkout/webhook payment confirmation.
- Admin dashboard and admin APIs.
- Agreement portal/payment-triggered agreement workflow.
- Google Calendar integration/reminder automation.
- Any durable database/ORM workflow.

Remaining client/professional decisions before calling content final:

- Confirm consultant legal name, title, credential number, regulator wording, and whether/how the credential should be displayed publicly.
- Confirm final phone number, public office address, map usage, business hours, languages, service area, and social profile URLs.
- Approve final privacy policy, terms/disclaimer, resource article content, and local SEO data.
- Confirm Zoho SMTP production values in Vercel without exposing them in source, screenshots, docs, or chat.
- Decide whether to remove or clarify `NEXT_PUBLIC_SITE_URL` from env documentation for V1 public metadata, because current public canonical URLs are sourced from `data/site.ts`; the env var is used by disabled future booking/payment flows.

Phase 16C audit validation:

- `npm run lint`: passed.
- `npm test`: passed, 33/33 tests.
- `npm run build`: passed.

Build note:

- Disabled future routes still appear in the Next.js route manifest because source files exist, but feature-flag layouts/handlers continue to redirect or 404 when flags are false. This is expected for the current code-preservation strategy.

## Candidate Next Work

This section does not choose the next feature; it lists logical candidates.

| Candidate | Current State | Dependencies | Main Work Remaining | Risk | Complexity |
| --- | --- | --- | --- | --- | --- |
| Final content/legal approval | Public site has Phase 16A cleanup and interim legal/resource pages | Client credential/content/legal confirmation | Approve privacy/terms, confirm credential display, finalize resources/social/local SEO | Medium | MEDIUM |
| Activate appointment booking | UI/domain logic exists but disabled | Database, policies, prices, Stripe decision | Durable repository, transaction/slot locking, final config, feature flag rollout | High | HIGH |
| Stripe production integration | Code/tests exist, disabled | Stripe account/webhook/env, durable appointments | Configure Checkout/webhook, test end-to-end, payment ops/refund policy | High | MEDIUM-HIGH |
| Google Calendar production integration | Adapter placeholder only | Google Cloud/service account/calendar access | Add API client, create/update/cancel events, retries, tests | Medium | MEDIUM-HIGH |
| Admin activation | UI/actions/auth exist, disabled | Durable DB, stronger auth policy | DB-backed records/audit, rate limiting/MFA, production QA | High | HIGH |
| Agreement/e-sign workflow | PDF/email exists; no acceptance/e-sign | Professional agreement approval, storage | Secure review route, PDF hash/storage, acceptance/signature flow, audit trail | High | HIGH |
| Reminder automation | Reminder records/functions exist | Durable DB, scheduler/email config | Vercel Cron or queue, retry policy, tests | Medium | MEDIUM |
| Analytics | Not implemented | Client analytics/privacy choice | Add privacy-compliant analytics, avoid assessment/contact PII | Medium | LOW-MEDIUM |
| SEO/content improvements | Metadata/sitemap/structured data exist | Content approval | Refine schema, approve guides, add final local SEO data when address confirmed | Low-Medium | MEDIUM |
| Security hardening | Good V1 basics, future systems need work | Decisions on auth/rate limiting/storage | Distributed rate limiting, admin hardening, route guard tests, secret audit | Medium | MEDIUM |

## Final Validation Snapshot

Validation commands run after Phase 16C audit:

- `npm run lint`: passed.
- `npm test`: passed, 33/33 tests.
- `npm run build`: passed.

Build notes:

- Disabled future routes still appear in the Next.js route manifest because source files exist, but feature-flag layouts/handlers continue to redirect or 404 when flags are false.
- Sitemap includes only public V1 routes plus service/resource pages unless appointment flags are enabled. Robots disallows `/admin/`, `/api/`, `/appointment/`, and `/consultation/`.
