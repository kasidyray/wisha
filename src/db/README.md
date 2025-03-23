# Database Setup Guide for Wish-Flare

This guide explains how to set up and manage your Supabase database for the Wish-Flare application.

## Setup Instructions

Follow these steps in order to set up your database correctly:

### First-time Setup

1. **Create a new Supabase project** through the Supabase dashboard if you haven't already.

2. **Reset database (if needed)**: If you need to start from scratch, you can run the `drop-all-tables.sql` script:
   ```
   psql -h your-supabase-host -U postgres -d postgres -f src/db/drop-all-tables.sql
   ```
   OR use the Supabase dashboard SQL editor to run the script contents.

3. **Create the database schema**: Run the `schema.sql` script to create all tables, indexes, and functions:
   ```
   psql -h your-supabase-host -U postgres -d postgres -f src/db/schema.sql
   ```
   OR use the Supabase dashboard SQL editor to run the script contents.

4. **Set up RLS policies**: Run the `auth-schema.sql` script to set up all authentication-related functions and RLS policies:
   ```
   psql -h your-supabase-host -U postgres -d postgres -f src/db/auth-schema.sql
   ```

### Updating Existing Database

If your tables are already created and you just need to update RLS policies:

1. **Update RLS policies only**: Run the `update-rls-policies.sql` script:
   ```
   psql -h your-supabase-host -U postgres -d postgres -f src/db/update-rls-policies.sql
   ```
   This script will drop existing policies and create new ones without affecting your tables or data.

## Troubleshooting Common Issues

### Error: relation "users" already exists

This means you're trying to create tables that already exist. Options:
- Use the `update-rls-policies.sql` script instead if you just want to update policies
- Run `drop-all-tables.sql` first if you want to completely reset the database

### Error: operator does not exist: text = uuid

This is a type mismatch in SQL queries or RLS policies. Our scripts have been updated to use proper type casting (`auth.uid()::uuid`) to fix this issue.

### Error: permission denied for table "xyz"

This is likely an RLS policy issue:
1. Make sure you're authenticated correctly
2. Check that RLS policies are set up correctly
3. Verify you're using the correct role (anon, authenticated, or service_role)

### Testing the Database Connection

You can use the `/test-supabase` route in the application to test your database connection, authentication, and RLS policies.

## Database Schema

The database consists of the following tables:

- **users**: Stores user profiles
- **events**: Stores event details (birthdays, weddings, etc.)
- **items**: Stores gift items for events
- **messages**: Stores messages for event discussions
- **activities**: Logs activity for events

Each table has appropriate RLS policies to ensure data security. 