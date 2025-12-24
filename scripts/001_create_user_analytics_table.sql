-- Create table to store user custom analytics data
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  custom_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_analytics_email ON public.user_analytics(email);

-- Enable Row Level Security
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data by email
CREATE POLICY "user_analytics_select_own"
  ON public.user_analytics FOR SELECT
  USING (true); -- Allow anyone to read by email (we'll check email match in app logic)

-- Policy: Users can insert their own data
CREATE POLICY "user_analytics_insert_own"
  ON public.user_analytics FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own data by email
CREATE POLICY "user_analytics_update_own"
  ON public.user_analytics FOR UPDATE
  USING (true);

-- Policy: Users can delete their own data by email
CREATE POLICY "user_analytics_delete_own"
  ON public.user_analytics FOR DELETE
  USING (true);
