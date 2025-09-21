-- Add email_id column to posts table to track Resend broadcast IDs
-- Run this in your Supabase SQL editor

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS email_id TEXT;

COMMENT ON COLUMN posts.email_id IS 'Resend broadcast ID for sent newsletters';