# Switch North Immigration Website

Foundation for the Switch North Immigration website.

## Development Data

The current business information in `data/site.ts` is development placeholder
data. It is realistic-looking for UI development only and must be replaced and
verified before production. `DEMO-RCIC-000000` is not a genuine professional
licence.

No fake reviews, testimonials, approval rates, case numbers, years of
experience, awards, government affiliations, CICC verification claims, or
success statistics should be added. If sample testimonials are ever needed for
UI development, label each one clearly as `SAMPLE TESTIMONIAL`.

## Logo Asset


The active logo is `public/assets/images/logo.jpeg` and is configured through
`siteConfig.logo.src` in `data/site.ts`. The shared `Logo` component uses
`next/image` and preserves the original `363x186` aspect ratio.

## Brand Tokens

The UI palette is centralized in `app/globals.css` around the supplied logo:
brand navy `#172A50`, deep ink `#0B1730`, compass teal `#0F7894`, arrow mint
`#2EC9A3`, soft surface `#F1F7F9`, border `#D7E1E7`, and sparse accent red
`#C2414B`.

## Pre-Production Checklist

[ ] Replace consultant name
[ ] Replace RCIC/CICC information
[ ] Verify consultant credentials
[ ] Replace phone
[ ] Verify email
[ ] Replace address
[ ] Confirm business hours
[ ] Add real social profiles
[ ] Confirm offered languages
[ ] Confirm immigration services
[ ] Add consultation booking URL
[ ] Replace sample consultation pricing
[ ] Connect appointment persistence
[ ] Connect payment provider and webhook verification
[ ] Review all immigration information
[ ] Add real privacy policy
[ ] Add real terms/disclaimer
[ ] Remove all sample testimonials
[ ] Verify production domain
[ ] Verify contact form destination
[ ] Review and approve service agreement template
[ ] Confirm service agreement fees, tax, refund terms, and governing province
[ ] Confirm service agreement delivery and storage policy
[ ] Connect approved e-signature provider if electronic signing is required
[ ] Set production admin credentials and session secret
[ ] Confirm admin audit-log retention policy

## Lead Workflow Environment Variables

The initial lead workflow is:

Website form -> Next.js server action -> email notification -> client
confirmation email.

No database is used for contact or assessment submissions, and submitted form
contents should not be sent to analytics or logged unnecessarily.

Create environment variables from `.env.example`.

Required when email delivery is enabled:

- `EMAIL_PROVIDER`: use `disabled` for local development or `resend` for the
  built-in Resend adapter.
- `EMAIL_FROM`: verified sender address for website emails.
- `LEAD_NOTIFICATION_TO`: inbox that receives internal lead notifications.
- `RESEND_API_KEY`: server-side Resend API key. Never expose this with a
  `NEXT_PUBLIC_` prefix.

Optional:

- `CAPTCHA_SECRET_KEY`: reserved for future CAPTCHA integration if spam becomes
  a problem. Leave unset until a provider verifier is implemented.

In development with `EMAIL_PROVIDER=disabled`, forms validate and show a
development success state without sending email. In production, email delivery
must be configured for submissions to be accepted.

## V1 Public Deployment

The V1 public website is a marketing and lead-generation site. Booking,
payment, service-agreement delivery, appointment management, and the admin
portal are preserved in the codebase for future phases, but they are disabled
by default and must stay disabled for the first public launch.

Enabled public routes for V1:

- `/`
- `/about`
- `/services` and `/services/*`
- `/assessment`
- `/tools/crs-calculator`
- `/resources` and `/resources/*`
- `/faq`
- `/contact`
- `/privacy` and `/terms`

Required V1 environment variable:

- `NEXT_PUBLIC_SITE_URL`: production site URL, for example
  `https://switchnorth.ca`.

Optional V1 lead-delivery variables:

- `EMAIL_PROVIDER`: `disabled` locally, or `resend` when the sender and API key
  are configured.
- `EMAIL_FROM`: verified sender address.
- `LEAD_NOTIFICATION_TO`: inbox for contact and assessment notifications.
- `RESEND_API_KEY`: server-side Resend key when `EMAIL_PROVIDER=resend`.
- `CAPTCHA_SECRET_KEY`: reserved for future spam protection.

V1 feature flags should remain disabled:

- `NEXT_PUBLIC_FEATURE_APPOINTMENTS=false`
- `FEATURE_APPOINTMENTS=false`
- `FEATURE_PAYMENTS=false`
- `FEATURE_AGREEMENT_PORTAL=false`
- `FEATURE_ADMIN_PORTAL=false`
- `FEATURE_APPOINTMENT_MANAGEMENT=false`

With appointments disabled, all standard consultation CTAs route to `/contact`.
The unfinished booking, payment, admin, and appointment-management routes are
also server-side guarded so they cannot be treated as production features by a
direct URL visit.

Deferred future-system variables are not required for V1 while the flags above
remain disabled:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Appointment Booking

Appointment booking is currently a future feature. Keep
`FEATURE_APPOINTMENTS=false` and `NEXT_PUBLIC_FEATURE_APPOINTMENTS=false` for
the V1 public launch.

The preserved booking code can be re-enabled in a later release after durable
persistence, payment, calendar, privacy, and operational processes are approved.

The integrated consultation booking flow lives at `/consultation`.

Current Phase 10 workflow:

Website booking form -> Next.js server action -> availability recheck ->
`PENDING_PAYMENT` appointment hold -> Phase 11 payment handoff.

The appointment system is split into:

- `data/booking.ts`: sample consultation types, sample prices, business hours,
  blocked times, unavailable dates, booking horizon, minimum notice, and
  timezone.
- `lib/booking/availability.ts`: slot generation, business-hour checks,
  minimum-notice checks, blocked-time checks, unavailable-date checks, and
  overlap prevention.
- `lib/booking/repository.ts`: appointment persistence interface with a
  development-only in-memory adapter.
- `lib/booking/service.ts`: pending appointment creation and payment handoff
  boundary.
- `lib/booking/validation.ts`: server-side booking validation.

The in-memory appointment adapter is not production persistence. Before paid
bookings go live, connect `AppointmentRepository` to a durable database. The
simplest production-suitable option for this project is managed Postgres, such
as Supabase or Neon, with a unique conflict strategy around active appointment
time ranges.

Payment is intentionally not implemented in Phase 10. Phase 11 should create a
payment session from the pending appointment, redirect the client to payment,
and mark the appointment `CONFIRMED` only after a verified provider webhook
reports successful payment.

## Stripe Consultation Payments

Stripe consultation payment is currently a future feature. Keep
`FEATURE_PAYMENTS=false` for the V1 public launch.

Consultation payment uses Stripe-hosted Checkout. The application never
collects or stores raw card details.

Phase 11 payment flow:

Client selects appointment -> appointment is created as `PENDING_PAYMENT` ->
server creates a Stripe Checkout Session -> client pays on Stripe -> Stripe
webhook verifies the event signature -> appointment becomes `CONFIRMED` ->
confirmation email workflow starts.

Required for Stripe test mode:

- `STRIPE_SECRET_KEY`: server-side Stripe secret key, usually `sk_test_...` in
  development.
- `STRIPE_WEBHOOK_SECRET`: webhook endpoint signing secret, usually
  `whsec_...`.
- `NEXT_PUBLIC_SITE_URL`: local or deployed site URL used for Checkout
  success/cancel redirects.

The webhook endpoint is `/api/stripe/webhook`. Only verified webhook events can
mark an appointment `PAID` and `CONFIRMED`; redirects to
`/consultation/confirmation` only display current server-side status.

Handled payment states:

- `checkout.session.completed`: records Stripe references, paid timestamp, and
  confirms the appointment only when `payment_status` is `paid`.
- `checkout.session.async_payment_failed` and
  `payment_intent.payment_failed`: mark payment failed and release the slot.
- `checkout.session.expired`: marks the pending hold expired and releases the
  slot.
- Duplicate webhook event IDs are ignored idempotently.

## Service Agreement PDF Workflow

Service Agreement PDF delivery is currently a future feature. Keep
`FEATURE_AGREEMENT_PORTAL=false` for the V1 public launch.

After a verified Stripe successful-payment webhook confirms an appointment, the
server generates a versioned Service Agreement PDF and emails it to the client
as an attachment. The browser redirect is never treated as payment proof.

Phase 12 agreement files:

- `data/agreement.ts`: template version and review-required placeholder fields.
- `types/agreement.ts`: strongly typed agreement, fee, timeline, and PDF data.
- `lib/agreement/template.ts`: numbered agreement sections based on the supplied
  sample agreement structure.
- `lib/agreement/generator.ts`: server-side PDF generation with logo, business
  contact details, page numbers, tables, initials, and signature placeholders.
- `lib/agreement/workflow.ts`: payment-confirmation fulfillment, email
  attachment delivery, duplicate-send protection, and appointment metadata
  tracking.
- `docs/AGREEMENT_REVIEW_CHECKLIST.md`: clauses and fields that must be
  approved before production use.

Agreement delivery uses the same server-side email variables listed above.
Generated PDFs are attached directly to email; no public agreement URLs are
created. Do not log agreement contents, send agreement data to analytics, or
enable production agreement delivery until the review checklist is complete.

## Admin Dashboard

The admin dashboard is currently a future feature. Keep
`FEATURE_ADMIN_PORTAL=false` and `FEATURE_APPOINTMENT_MANAGEMENT=false` for the
V1 public launch.

The internal admin dashboard lives at `/admin` and is intentionally limited to
appointment operations. It includes dashboard metrics, appointment search and
filters, appointment detail records, simple client grouping, safe appointment
status actions, email resend actions, agreement resend actions, and a
lightweight audit log.

Admin authentication uses a single signed, HttpOnly session cookie for one
consultant/admin account. There is no public registration, staff management, or
role hierarchy.

Required before exposing `/admin` outside local development:

- `ADMIN_USERNAME`: admin login username.
- `ADMIN_PASSWORD`: strong admin password.
- `ADMIN_SESSION_SECRET`: long random secret used to sign admin session tokens.

In local development only, the fallback credentials are `admin` and
`change-this-admin-password`. Do not use these in production.

The current appointment and audit repositories are development in-memory
adapters. Before production, connect the repository interfaces to durable
private storage, such as managed Postgres, and keep audit logs free of
unnecessary personal information.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run build
```
