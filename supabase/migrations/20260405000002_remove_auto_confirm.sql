-- Remove dev-only auto-confirm trigger for production
-- Users should verify their email in production
-- To re-enable for development, run the 20260329000002 migration again

DROP TRIGGER IF EXISTS on_user_auto_confirm ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();
