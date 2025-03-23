# Authentication Implementation Guide

This document describes how authentication is implemented in the Wish-Flare application using Supabase Auth.

## Overview

Wish-Flare uses Supabase for authentication, providing secure user sign-up, sign-in, and session management. The authentication flow integrates with our database to store user profiles and manage user-specific data.

## Authentication Architecture

Our authentication system consists of:

1. **Supabase Auth** - For user authentication and session management
2. **User Profiles** - Stored in our database to contain user-specific information
3. **AuthContext** - React context for managing authentication state
4. **Auth Service** - Interface between our application and Supabase

## Components

### 1. Auth Service (`src/services/auth.ts`)

The auth service handles all interactions with Supabase Auth, providing methods for:

- `signUp()` - Register new users
- `signIn()` - Authenticate existing users
- `signOut()` - Log users out
- `getSession()` - Get the current session
- `getCurrentUser()` - Get the current authenticated user
- `updatePassword()` - Update user password
- `resetPassword()` - Send password reset emails
- `updateProfile()` - Update user profile information
- `checkUserExists()` - Check if a user exists

### 2. Auth Context (`src/contexts/AuthContext.tsx`)

The Auth Context provides a convenient way to access authentication state throughout the application:

- `user` - Current user information
- `session` - Current session information
- `isLoading` - Authentication loading state
- `login()` - Sign in function
- `logout()` - Sign out function
- `signup()` - Registration function
- `checkUserExists()` - User existence check

### 3. User Hook (`src/hooks/useUser.ts`)

A convenient hook for accessing and refreshing user data:

- `user` - Current user data
- `isLoading` - Loading state
- `refreshUser()` - Function to refresh user data

### 4. Protected Route Component (`src/components/ProtectedRoute.tsx`)

Ensures that only authenticated users can access certain routes.

## Database Schema

The authentication system relies on these database tables:

1. `users` - Stores user profile information
   - Connected to Supabase Auth via the user ID

Row-Level Security (RLS) policies ensure that:
- Users can only view/update their own data
- Public information is properly scoped
- Service roles can perform administrative tasks

## Authentication Flow

1. **Sign Up**:
   - User provides email, password, and name
   - Supabase Auth creates an account
   - Our application creates a user profile

2. **Sign In**:
   - User provides email and password
   - Supabase Auth verifies credentials
   - Our application loads the user profile

3. **Session Management**:
   - Supabase Auth handles session persistence
   - Our application checks for existing sessions on load

4. **Protected Routes**:
   - Routes requiring authentication check for a valid user
   - Unauthorized users are redirected to login

## Implementation Notes

- No email verification is required (as per project requirements)
- No two-factor authentication is implemented (as per project requirements)
- Sessions are managed by Supabase and persist across browser restarts

## Security Considerations

- All sensitive user data is stored in Supabase Auth, not in our database
- Passwords are never stored in plaintext
- RLS policies restrict access to data based on user identity
- Authentication tokens are stored securely by Supabase

## Setup Requirements

1. Supabase project with Auth enabled
2. Database tables with proper RLS policies (see `auth-schema.sql`)
3. Environment variables configured with Supabase credentials

## Testing Authentication

You can test the authentication flow by:

1. Creating a new account on the signup page
2. Signing in with the created account
3. Accessing protected routes
4. Signing out and verifying that protected routes are no longer accessible 