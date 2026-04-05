-- ─────────────────────────────────────────────────────────────────────────────
-- Security fixes migration
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Restaurants: only owner can insert their own restaurant ────────────────

DROP POLICY IF EXISTS "Authenticated users can insert restaurants" ON public.restaurants;

CREATE POLICY "Owners can insert their own restaurant"
  ON public.restaurants
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- ── 2. Videos: allow creators to delete their own videos ─────────────────────

DROP POLICY IF EXISTS "Creators can delete own videos" ON public.videos;

CREATE POLICY "Creators can delete own videos"
  ON public.videos
  FOR DELETE
  USING (auth.uid() = creator_id);

-- ── 3. Order total validation trigger ────────────────────────────────────────
-- Rejects any INSERT or UPDATE on orders where the client-submitted total
-- does not match the server-computed sum of subtotal + tax + delivery_fee + tip.
-- Tolerance: ±$0.02 to account for floating-point rounding.

CREATE OR REPLACE FUNCTION validate_order_total()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  expected numeric;
BEGIN
  expected := ROUND(
    COALESCE(NEW.subtotal, 0)
    + COALESCE(NEW.tax, 0)
    + COALESCE(NEW.delivery_fee, 0)
    + COALESCE(NEW.tip, 0),
    2
  );

  IF ABS(ROUND(NEW.total, 2) - expected) > 0.02 THEN
    RAISE EXCEPTION
      'Order total mismatch: submitted % but expected %',
      ROUND(NEW.total, 2), expected;
  END IF;

  IF NEW.subtotal < 0 OR NEW.tax < 0 OR NEW.delivery_fee < 0 OR NEW.tip < 0 THEN
    RAISE EXCEPTION 'Order amounts cannot be negative';
  END IF;

  IF NEW.tip > NEW.subtotal * 0.5 THEN
    RAISE EXCEPTION 'Tip cannot exceed 50%% of subtotal';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_order_total ON public.orders;

CREATE TRIGGER trg_validate_order_total
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION validate_order_total();

-- ── 4. Order items: validate unit_price matches menu_items.price ─────────────

CREATE OR REPLACE FUNCTION validate_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  actual_price numeric;
BEGIN
  SELECT price INTO actual_price
  FROM public.menu_items
  WHERE id = NEW.menu_item_id;

  IF actual_price IS NULL THEN
    RAISE EXCEPTION 'Menu item % does not exist', NEW.menu_item_id;
  END IF;

  IF ABS(NEW.unit_price - actual_price) > 0.01 THEN
    RAISE EXCEPTION
      'Price mismatch for menu item %: submitted % but current price is %',
      NEW.menu_item_id, NEW.unit_price, actual_price;
  END IF;

  IF NEW.quantity < 1 OR NEW.quantity > 99 THEN
    RAISE EXCEPTION 'Item quantity must be between 1 and 99';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_order_item_price ON public.order_items;

CREATE TRIGGER trg_validate_order_item_price
  BEFORE INSERT OR UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION validate_order_item_price();
