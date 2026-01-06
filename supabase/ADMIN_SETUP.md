# Admin User Setup

This guide explains how to create an admin user for the Beauty × AI Atlas.

## Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter the following:
   - **Email**: `info@francescatabor.com`
   - **Password**: `Brazil89*`
   - **Auto Confirm User**: ✅ (checked)
5. Click **Create User**
6. Once the user is created, click on the user to edit
7. Scroll down to **User Metadata** section
8. In the **Raw App Meta Data** field, add:
   ```json
   {
     "role": "admin"
   }
   ```
9. Click **Save**

## Method 2: Using SQL Script

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create the user first via Dashboard (Method 1, steps 1-5)
4. Then run the SQL script: `supabase/create-admin-user.sql`
5. This will set the admin role in `app_metadata`

## Method 3: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Create user via Supabase Management API
supabase auth admin create-user \
  --email info@francescatabor.com \
  --password "Brazil89*" \
  --email-confirm \
  --user-metadata '{"role": "admin"}'
```

## Verify Admin Access

1. Go to `/login` on your site
2. Sign in with:
   - Email: `info@francescatabor.com`
   - Password: `Brazil89*`
3. You should be redirected to `/admin` dashboard
4. You should see the "Admin" link in the header

## Troubleshooting

- **Can't sign in**: Make sure the user is created and email is confirmed
- **No admin access**: Verify `app_metadata.role` is set to `"admin"` in Supabase
- **403 Forbidden**: Check that the role is in `app_metadata`, not just `user_metadata`

## Security Notes

- Change the default password after first login
- Use strong passwords in production
- Consider using environment variables for admin credentials in development

