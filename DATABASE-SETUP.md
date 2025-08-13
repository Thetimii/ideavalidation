# 🗄️ Database Setup Guide

## **SQL Files Setup Order**

You need to run these SQL files in your Supabase dashboard in this exact order:

### **1. ✅ REQUIRED: supabase-schema.sql**

This is your main database schema. Run this first.

- Creates `pages`, `users`, `projects`, `leads`, `images`, `analytics_events` tables
- Sets up Row Level Security (RLS)
- Creates basic indexes and functions

### **2. ✅ REQUIRED: supabase-async-jobs.sql**

This is required for the async generation system to work.

- Creates `generation_jobs` table (tracks AI generation progress)
- Creates `job_updates` table (real-time progress updates)
- Creates functions for job progress tracking
- **Without this, the async generation will fail!**

### **3. 🔧 OPTIONAL: supabase-custom-domains.sql**

Only needed if you want custom domain functionality.

- Creates `custom_domains` table
- Creates `domain_verification` table
- Adds custom domain functions
- You can skip this for now and add later

## **Setup Steps**

### **Step 1: Open Supabase Dashboard**

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to "SQL Editor" in the left sidebar

### **Step 2: Run Required SQL Files**

```sql
-- 1. FIRST: Copy and paste supabase-schema.sql
-- Click "Run" button

-- 2. SECOND: Copy and paste supabase-async-jobs.sql
-- Click "Run" button

-- 3. OPTIONAL: Copy and paste supabase-custom-domains.sql
-- Click "Run" button (only if you want custom domains)
```

### **Step 3: Verify Tables Created**

Go to "Table Editor" and check you have these tables:

- ✅ `pages`
- ✅ `generation_jobs` (new)
- ✅ `job_updates` (new)
- ✅ `users`
- ✅ `projects`
- ✅ `leads`
- ✅ `images`
- ✅ `analytics_events`

## **Current Status**

Based on your setup, you probably have:

- ✅ `supabase-schema.sql` already run (since websites were working)
- ❌ `supabase-async-jobs.sql` NOT run yet (this is why async generation fails)
- ❌ `supabase-custom-domains.sql` NOT run yet (but not needed immediately)

## **Quick Fix**

To fix your current error and get async generation working:

1. **Copy the contents of `supabase-async-jobs.sql`**
2. **Paste into Supabase SQL Editor**
3. **Click "Run"**
4. **Restart your dev server:** `npm run dev`
5. **Test the async generation!**

## **After Setup**

Once you run `supabase-async-jobs.sql`, your app will have:

- ✨ Beautiful real-time progress tracking
- 🚀 No timeout issues on Vercel
- 📊 Live progress updates with animations
- 🎯 Professional user experience

The custom domains are optional - you can add that feature later when you want to offer users the ability to use their own domains!
