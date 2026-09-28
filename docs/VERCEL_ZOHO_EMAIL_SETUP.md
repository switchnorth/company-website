# Vercel Zoho Email Setup

Configure these in Vercel under Project -> Settings -> Environment Variables.
Add them for Production, and for Preview only if preview deployments should send real email.
After adding or changing production environment variables, trigger a new Vercel deployment.

| Variable | Purpose | Required | Example format |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public canonical site URL used by metadata and email links. | Yes | `https://switchnorth.ca` |
| `EMAIL_PROVIDER` | Selects the server-side email provider. Use Zoho SMTP for V1. | Yes | `zoho` |
| `EMAIL_FROM` | Authenticated sender identity shown to visitors and Zoho. Must use the Switch North mailbox/domain. | Yes | `Switch North Immigration <info@switchnorth.ca>` |
| `CONTACT_RECIPIENT` | Inbox that receives contact and assessment notifications. | Yes | `info@switchnorth.ca` |
| `SMTP_HOST` | Zoho SMTP hostname from the client's Zoho Mail admin/account settings. Do not guess this value. | Yes | `smtp.example-from-zoho-settings.com` |
| `SMTP_PORT` | Zoho SMTP port from the client's Zoho Mail admin/account settings. | Yes | `465` or another Zoho-provided value |
| `SMTP_SECURE` | Whether the SMTP connection uses TLS immediately. Match Zoho's settings for the chosen port. | Yes | `true` or `false` |
| `SMTP_USER` | Authenticated Zoho mailbox username. | Yes | `info@switchnorth.ca` |
| `SMTP_PASSWORD` | Zoho mailbox app password or SMTP password. Store only in Vercel secrets. | Yes | `zoho-app-password-value` |
| `CAPTCHA_SECRET_KEY` | Reserved for future CAPTCHA integration if spam increases. | No | blank until implemented |

Keep these V1 feature flags disabled in production until booking/payment/admin work is intentionally launched:

| Variable | V1 value |
| --- | --- |
| `NEXT_PUBLIC_FEATURE_APPOINTMENTS` | `false` |
| `FEATURE_APPOINTMENTS` | `false` |
| `FEATURE_PAYMENTS` | `false` |
| `FEATURE_AGREEMENT_PORTAL` | `false` |
| `FEATURE_ADMIN_PORTAL` | `false` |
| `FEATURE_APPOINTMENT_MANAGEMENT` | `false` |

Do not add real SMTP credentials to `.env.example`, README files, commits, tickets, or screenshots.
The website sends notification emails from the authenticated Switch North mailbox to `CONTACT_RECIPIENT` and sets `Reply-To` to the visitor's validated email address so replies go directly to the prospective client.
