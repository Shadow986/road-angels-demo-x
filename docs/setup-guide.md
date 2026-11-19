# Road Angels RSA — Setup Guide

This guide covers the infrastructure configuration needed for the platform.

---

## 1. Email Verification (Supabase SMTP)

Registration sends a confirmation email via Supabase Auth. By default, Supabase uses a
built-in email service with strict rate limits (3-4 emails per hour). For production:

### Option A: Use Supabase's built-in email (testing only)
1. Go to your Supabase dashboard → **Authentication** → **Email Templates**
2. Verify the "Confirm signup" template is configured
3. Go to **Authentication** → **Providers** → **Email**
4. Ensure "Confirm email" is enabled

### Option B: Configure custom SMTP (recommended for production)
1. Go to **Project Settings** → **Authentication** → **SMTP Settings**
2. Enable custom SMTP
3. Use a service like SendGrid, Postmark, or AWS SES:
   - **Host**: e.g. `smtp.sendgrid.net`
   - **Port**: 587
   - **Username**: (your SMTP provider username)
   - **Password**: (your SMTP provider password)
   - **Sender email**: e.g. `noreply@roadangelsrsa.co.za`
4. Save and test

### What the code does
- `AuthPage.jsx` calls `supabase.auth.signUp()` with `emailRedirectTo: window.location.origin`
- After signup, user profile data (name, phone, VIN, etc.) is saved to the `profiles` table
- User sees "Check Your Email" screen with instructions
- User must click the confirmation link before they can log in

---

## 2. Paystack Subscription Plan

The subscription uses a Paystack **Plan** for recurring billing. The plan must be created
on the Paystack dashboard before users can subscribe.

### Step 1: Create the plan on Paystack
1. Log in to your Paystack dashboard (https://dashboard.paystack.co)
2. Go to **Subscriptions and Plans** → **Create Plan**
3. Configure:
   - **Name**: Road Angels Daily Subscription
   - **Amount**: R1.00 (or your desired amount)
   - **Currency**: ZAR
   - **Interval**: Daily
   - **Invoice limit**: 0 (unlimited)
4. Save the plan
5. Copy the **Plan Code** (format: `PLN_xxxxxxxxxxxxxxxxxxxx`)

### Step 2: Add the plan ID to your environment
In your `.env` file:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx     # or pk_live_xxxxx for production
VITE_PAYSTACK_PLAN_ID=PLN_xxxxxxxxxxxxxxxxxxxx   # from step 1
```

### Step 3: Deploy edge functions with secret key
The `verify-payment` and `paystack-webhook` edge functions need the Paystack secret key:

```bash
# Set the secret key as a Supabase secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxx
# Or for production:
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxxx

# Also set the Supabase service role key (needed by edge functions)
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Set up the webhook (optional but recommended)
1. Go to Paystack dashboard → **Settings** → **Webhooks**
2. Add your webhook URL: `https://your-project.supabase.co/functions/v1/paystack-webhook`
3. Copy the webhook secret and use it to verify signatures

### Error handling in the code
- If `VITE_PAYSTACK_PLAN_ID` is not set, the payment will process as a one-time charge
  (no recurring subscription) and show a warning on close
- If the plan doesn't exist on Paystack, the Paystack iframe will show an error
- The `onClose` callback shows: "Subscription plan not configured. Please contact the admin team."

---

## 3. Admin Panel Data Flow

### Architecture: No subdomain or CURL needed

The admin panel is **built into the same application** as the client portal. It uses the same
Supabase backend with **Row Level Security (RLS) policies** to control access. This is the
correct architecture — no separate subdomain or CURL communication is required.

### How it works
1. **Single-page application**: The admin dashboard is rendered when a user with `role = 'admin'`
   navigates to the admin dashboard view (accessed via the "SECURE TERMINAL" link in the footer)
2. **Supabase RLS**: The `is_admin()` PostgreSQL function checks if the current user's profile
   has `role = 'admin'`. RLS policies use this to allow admins to read all profiles, vehicles,
   and payments — while regular users can only see their own data
3. **Direct database access**: The admin dashboard queries Supabase directly using the same
   client. No CURL, no API endpoints, no subdomain needed

### Data flow verification checklist
If the admin panel is not showing data, check these in order:

1. **Has the migration been applied?**
   ```sql
   -- Check that the is_admin function exists
   SELECT proname FROM pg_proc WHERE proname = 'is_admin';
   
   -- Check that RLS policies exist
   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
   ```

2. **Does the admin user have the correct role?**
   ```sql
   SELECT id, full_name, email, role FROM profiles WHERE role = 'admin';
   ```
   If no admins exist, run the SQL from `supabase/migrations/20261026000000_create_admin_panel.sql`
   (section 8 creates a temporary admin user: `admin@roadangelsrsa.co.za` / `TempAdmin2026!`)

3. **Is the admin logged in?**
   The admin must authenticate via the admin login page (footer → "SECURE TERMINAL")
   The login checks `role = 'admin'` in the profiles table after Supabase auth

4. **Are there any profiles/vehicles/payments in the database?**
   ```sql
   SELECT count(*) FROM profiles;
   SELECT count(*) FROM vehicles;
   SELECT count(*) FROM payments;
   ```
   If these return 0, it's simply that no data has been created yet (test phase)

### Why a subdomain is NOT needed
- The admin and client portals share the same Supabase database
- RLS policies enforce data isolation — regular users can't see other users' data
- A separate subdomain + CURL would add unnecessary complexity and latency
- The current SPA approach is the standard pattern for Supabase + React apps

---

## 4. Database Migrations

Run these migrations in order on your Supabase project:

| File | Purpose |
|------|---------|
| `20260507182521_create_payments_table.sql` | Payments table |
| `20260507200825_fix_profiles_rls.sql` | Profiles RLS policies |
| `20260508020519_add_role_to_profiles.sql` | Role column |
| `20260511022038_vehicle_images.sql` | Vehicle images |
| `20260512204330_create_vehicles_table.sql` | Vehicles table |
| `20260707131500_add_full_name_to_profiles.sql` | Full name column |
| `20260805000000_add_phone_to_profiles.sql` | Phone column |
| `20260809000000_add_member_details_to_profiles.sql` | Member details |
| `20261026000000_create_admin_panel.sql` | Admin panel tables + RLS + admin user |
| `20261119000000_add_vin_column.sql` | VIN column on profiles + vehicles |

---

## 5. Admin Credentials

| Field | Value |
|-------|-------|
| Admin login URL | Footer → "SECURE TERMINAL" or direct URL to the app with admin-login view |
| Admin email | `admin@roadangelsrsa.co.za` |
| Admin password | `TempAdmin2026!` (change after first login) |

> **Security**: Change the admin password immediately after first login. The admin login page
> is intentionally hidden (no prominent link) — accessed via the footer "SECURE TERMINAL" text.
