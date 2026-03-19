import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import {
  MOCK_RESTAURANTS,
  MOCK_MENU_CATEGORIES,
  MOCK_MENU_ITEMS,
} from "@/lib/mock-data";
import { MenuItem, MenuCategory } from "@/types";
import { useRestaurant } from "@/hooks/use-restaurants";
import { useMenuCategories, useMenuItems } from "@/hooks/use-menu";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Category Tab Bar ──────────────────────────────────────────────────────

function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={tabStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tabStyles.scrollContent}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              tabStyles.tab,
              activeId === cat.id && tabStyles.tabActive,
            ]}
          >
            <Text
              style={[
                tabStyles.tabText,
                activeId === cat.id && tabStyles.tabTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.dark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkElevated,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: COLORS.darkSurface,
  },
  tabActive: {
    backgroundColor: COLORS.coral,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});

// ─── Menu Item Card ────────────────────────────────────────────────────────

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={itemStyles.card}>
      <View style={itemStyles.info}>
        <View style={itemStyles.nameRow}>
          <Text style={itemStyles.name}>{item.name}</Text>
          {item.is_popular && (
            <View style={itemStyles.popularBadge}>
              <Text style={itemStyles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        {item.description && (
          <Text style={itemStyles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text style={itemStyles.price}>{formatCurrency(item.price)}</Text>
      </View>

      <View style={itemStyles.actions}>
        {quantity > 0 ? (
          <View style={itemStyles.quantityControl}>
            <Pressable onPress={onRemove} style={itemStyles.quantityButton}>
              <Minus size={16} color={COLORS.white} />
            </Pressable>
            <Text style={itemStyles.quantityText}>{quantity}</Text>
            <Pressable
              onPress={onAdd}
              style={[itemStyles.quantityButton, itemStyles.quantityButtonAdd]}
            >
              <Plus size={16} color={COLORS.white} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={onAdd} style={itemStyles.addButton}>
            <Plus size={18} color={COLORS.white} />
            <Text style={itemStyles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const itemStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  popularBadge: {
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.coral,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.coral,
    marginTop: 2,
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.coral,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.darkElevated,
    borderRadius: 10,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.darkHover,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonAdd: {
    backgroundColor: COLORS.coral,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    minWidth: 20,
    textAlign: "center",
  },
});

// ─── Cart Summary ──────────────────────────────────────────────────────────

function CartSummary({ onClose }: { onClose: () => void }) {
  const { items, subtotal, tax, total, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown.duration(200)}
      style={cartStyles.overlay}
    >
      <View style={cartStyles.container}>
        <View style={cartStyles.header}>
          <Text style={cartStyles.title}>Your Order</Text>
          <View style={cartStyles.headerActions}>
            <Pressable onPress={clearCart} style={cartStyles.clearButton}>
              <Trash2 size={16} color={COLORS.error} />
              <Text style={cartStyles.clearText}>Clear</Text>
            </Pressable>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={22} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={cartStyles.itemsList}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => (
            <View key={item.id} style={cartStyles.cartItem}>
              <View style={cartStyles.cartItemInfo}>
                <Text style={cartStyles.cartItemName}>
                  {item.menuItem.name}
                </Text>
                <Text style={cartStyles.cartItemPrice}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
              <View style={cartStyles.cartItemQuantity}>
                <Pressable
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  style={cartStyles.cartQtyBtn}
                >
                  <Minus size={14} color={COLORS.white} />
                </Pressable>
                <Text style={cartStyles.cartQtyText}>{item.quantity}</Text>
                <Pressable
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  style={[cartStyles.cartQtyBtn, cartStyles.cartQtyBtnAdd]}
                >
                  <Plus size={14} color={COLORS.white} />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={cartStyles.totals}>
          <View style={cartStyles.totalRow}>
            <Text style={cartStyles.totalLabel}>Subtotal</Text>
            <Text style={cartStyles.totalValue}>
              {formatCurrency(subtotal())}
            </Text>
          </View>
          <View style={cartStyles.totalRow}>
            <Text style={cartStyles.totalLabel}>Tax</Text>
            <Text style={cartStyles.totalValue}>
              {formatCurrency(tax())}
            </Text>
          </View>
          <View style={cartStyles.totalDivider} />
          <View style={cartStyles.totalRow}>
            <Text style={cartStyles.totalLabelBold}>Total</Text>
            <Text style={cartStyles.totalValueBold}>
              {formatCurrency(total())}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            // In a real app, navigate to checkout
            onClose();
          }}
          style={cartStyles.checkoutButton}
        >
          <Text style={cartStyles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const cartStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.darkSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "65%",
    borderTopWidth: 1,
    borderTopColor: COLORS.darkElevated,
  },
  container: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.white,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.error,
  },
  itemsList: {
    maxHeight: 200,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkElevated,
  },
  cartItemInfo: {
    flex: 1,
    gap: 2,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.coral,
  },
  cartItemQuantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartQtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  cartQtyBtnAdd: {
    backgroundColor: COLORS.coral,
  },
  cartQtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    minWidth: 16,
    textAlign: "center",
  },
  totals: {
    marginTop: 16,
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  totalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.darkElevated,
    marginVertical: 4,
  },
  totalLabelBold: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  totalValueBold: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
  },
  checkoutButton: {
    backgroundColor: COLORS.coral,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});

// ─── Main Screen ───────────────────────────────────────────────────────────

type SectionData = {
  title: string;
  categoryId: string;
  data: MenuItem[];
};

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [showCart, setShowCart] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const sectionListRef = useRef<SectionList<MenuItem, SectionData>>(null);

  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    setRestaurant,
    restaurantId,
  } = useCartStore();

  // Fetch real data with mock fallback
  const { data: realRestaurant } = useRestaurant(slug);
  const restaurant = realRestaurant || MOCK_RESTAURANTS.find((r) => r.slug === slug) || null;

  const { data: realCategories } = useMenuCategories(restaurant?.id ?? "");
  const { data: realMenuItems } = useMenuItems(restaurant?.id ?? "");

  const categories = useMemo(
    () => {
      if (realCategories && realCategories.length > 0) return realCategories;
      return restaurant ? MOCK_MENU_CATEGORIES[restaurant.id] ?? [] : [];
    },
    [restaurant, realCategories]
  );

  const menuItems = useMemo(
    () => {
      if (realMenuItems && realMenuItems.length > 0) return realMenuItems;
      return restaurant ? MOCK_MENU_ITEMS[restaurant.id] ?? [] : [];
    },
    [restaurant, realMenuItems]
  );

  const sections: SectionData[] = useMemo(() => {
    return categories
      .filter((cat) => cat.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((cat) => ({
        title: cat.name,
        categoryId: cat.id,
        data: menuItems
          .filter((item) => item.category_id === cat.id && item.is_available)
          .sort((a, b) => a.sort_order - b.sort_order),
      }))
      .filter((section) => section.data.length > 0);
  }, [categories, menuItems]);

  // Set initial active category
  useMemo(() => {
    if (sections.length > 0 && !activeCategoryId) {
      setActiveCategoryId(sections[0].categoryId);
    }
  }, [sections]);

  const getItemQuantity = useCallback(
    (menuItemId: string): number => {
      return cartItems
        .filter((ci) => ci.menuItem.id === menuItemId)
        .reduce((sum, ci) => sum + ci.quantity, 0);
    },
    [cartItems]
  );

  const handleAddItem = useCallback(
    (item: MenuItem) => {
      if (restaurant) {
        // If switching restaurants, we should clear cart - for now just set
        if (restaurantId !== restaurant.id) {
          setRestaurant(restaurant.id, restaurant.name);
        }
        addItem({
          menuItem: item,
          quantity: 1,
          customizations: [],
          specialInstructions: "",
          totalPrice: item.price,
        });
      }
    },
    [restaurant, restaurantId, addItem, setRestaurant]
  );

  const handleRemoveItem = useCallback(
    (item: MenuItem) => {
      const cartItem = cartItems.find((ci) => ci.menuItem.id === item.id);
      if (cartItem) {
        if (cartItem.quantity <= 1) {
          removeItem(cartItem.id);
        } else {
          updateQuantity(cartItem.id, cartItem.quantity - 1);
        }
      }
    },
    [cartItems, removeItem, updateQuantity]
  );

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setActiveCategoryId(categoryId);
      const sectionIndex = sections.findIndex(
        (s) => s.categoryId === categoryId
      );
      if (sectionIndex >= 0 && sectionListRef.current) {
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          animated: true,
          viewOffset: 60,
        });
      }
    },
    [sections]
  );

  if (!restaurant) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Pressable onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const count = itemCount();
  const sub = subtotal();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ArrowLeft size={24} color={COLORS.white} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{restaurant.name}</Text>
          <Text style={styles.headerSubtitle}>Order Online</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          activeId={activeCategoryId}
          onSelect={handleCategorySelect}
        />
      )}

      {/* Menu List */}
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            quantity={getItemQuantity(item.id)}
            onAdd={() => handleAddItem(item)}
            onRemove={() => handleRemoveItem(item)}
          />
        )}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0 && viewableItems[0].section) {
            const section = viewableItems[0].section as SectionData;
            if (section.categoryId !== activeCategoryId) {
              setActiveCategoryId(section.categoryId);
            }
          }
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />

      {/* Floating Cart Button */}
      {count > 0 && !showCart && (
        <Animated.View
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.duration(150)}
          style={[
            styles.floatingCartButton,
            { bottom: insets.bottom + 16 },
          ]}
        >
          <Pressable
            onPress={() => setShowCart(true)}
            style={styles.floatingCartPressable}
          >
            <View style={styles.floatingCartLeft}>
              <View style={styles.floatingCartBadge}>
                <Text style={styles.floatingCartBadgeText}>{count}</Text>
              </View>
              <Text style={styles.floatingCartLabel}>View Cart</Text>
            </View>
            <Text style={styles.floatingCartTotal}>
              {formatCurrency(sub)}
            </Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Cart Summary */}
      {showCart && <CartSummary onClose={() => setShowCart(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerSpacer: {
    width: 40,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: 120,
  },

  // Floating Cart Button
  floatingCartButton: {
    position: "absolute",
    left: 16,
    right: 16,
  },
  floatingCartPressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.coral,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  floatingCartBadge: {
    backgroundColor: COLORS.white,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCartBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.coral,
  },
  floatingCartLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  floatingCartTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },

  // Error
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 16,
  },
  errorButton: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
