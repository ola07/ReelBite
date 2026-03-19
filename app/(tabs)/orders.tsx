import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ShoppingBag, Clock, CheckCircle, ChevronRight } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { useOrders } from "@/hooks";

type MockOrder = {
  id: string;
  restaurant: string;
  items: string[];
  total: number;
  status: "preparing" | "ready" | "delivered" | "picked_up";
  date: string;
  orderNumber: string;
};

const MOCK_ACTIVE_ORDERS: MockOrder[] = [
  {
    id: "o1",
    restaurant: "Bella Napoli",
    items: ["Margherita Pizza x1", "Cacio e Pepe x1"],
    total: 38.98,
    status: "preparing",
    date: "2026-03-16",
    orderNumber: "RB-4A8F21",
  },
];

const MOCK_PAST_ORDERS: MockOrder[] = [
  {
    id: "o2",
    restaurant: "Bangkok Garden",
    items: ["Pad Thai x2", "Spring Rolls x1"],
    total: 42.97,
    status: "delivered",
    date: "2026-03-14",
    orderNumber: "RB-3C7E19",
  },
  {
    id: "o3",
    restaurant: "La Cocina de Abuela",
    items: ["Birria Tacos x3", "Horchata x2"],
    total: 31.95,
    status: "picked_up",
    date: "2026-03-12",
    orderNumber: "RB-2B6D18",
  },
  {
    id: "o4",
    restaurant: "Spice Route",
    items: ["Butter Chicken x1", "Garlic Naan x2", "Mango Lassi x1"],
    total: 36.97,
    status: "delivered",
    date: "2026-03-10",
    orderNumber: "RB-1A5C17",
  },
];

function getStatusConfig(status: MockOrder["status"]) {
  switch (status) {
    case "preparing":
      return { label: "Preparing", color: COLORS.coral, icon: Clock };
    case "ready":
      return { label: "Ready for Pickup", color: COLORS.success, icon: CheckCircle };
    case "delivered":
      return { label: "Delivered", color: COLORS.textSecondary, icon: CheckCircle };
    case "picked_up":
      return { label: "Picked Up", color: COLORS.textSecondary, icon: CheckCircle };
  }
}

function OrderCard({ order, isActive }: { order: MockOrder; isActive: boolean }) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Pressable
      style={({ pressed }) => [styles.orderCard, pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }]}
    >
      <View style={styles.orderHeader}>
        <View style={styles.restaurantIcon}>
          <Text style={styles.restaurantInitial}>{order.restaurant[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.restaurantName}>{order.restaurant}</Text>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        </View>
        <ChevronRight size={20} color={COLORS.textSecondary} />
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, i) => (
          <Text key={i} style={styles.itemText}>{item}</Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + "20" }]}>
          <StatusIcon size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        <Text style={styles.totalText}>${order.total.toFixed(2)}</Text>
      </View>

      {isActive && (
        <View style={styles.trackBar}>
          <View style={[styles.trackProgress, { width: order.status === "preparing" ? "50%" : "100%" }]} />
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const { data: realOrders, isLoading } = useOrders(activeTab);

  // Convert real orders to display format, fall back to mock
  const orders = useMemo(() => {
    if (realOrders && realOrders.length > 0) {
      return realOrders.map((o): MockOrder => ({
        id: o.id,
        restaurant: o.restaurant?.name || "Restaurant",
        items: o.items?.map((i) => `${i.menu_item?.name || "Item"} x${i.quantity}`) || [],
        total: Number(o.total),
        status: (o.status === "confirmed" || o.status === "preparing" ? "preparing" :
                 o.status === "ready" ? "ready" :
                 o.status === "picked_up" ? "picked_up" : "delivered") as MockOrder["status"],
        date: o.created_at,
        orderNumber: o.order_number,
      }));
    }
    return activeTab === "active" ? MOCK_ACTIVE_ORDERS : MOCK_PAST_ORDERS;
  }, [realOrders, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.tabTextActive]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "past" && styles.tabActive]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, activeTab === "past" && styles.tabTextActive]}>
            Past
          </Text>
        </Pressable>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color={COLORS.textTertiary} strokeWidth={1} />
          <Text style={styles.emptyTitle}>No {activeTab} orders</Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === "active"
              ? "Your active orders will appear here"
              : "Your order history will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} isActive={activeTab === "active"} />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.darkElevated,
  },
  tabActive: {
    backgroundColor: COLORS.coral,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  orderCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  restaurantIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.coral,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  orderNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  orderItems: {
    marginBottom: 12,
    paddingLeft: 52,
  },
  itemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  trackBar: {
    height: 3,
    backgroundColor: COLORS.darkElevated,
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  trackProgress: {
    height: "100%",
    backgroundColor: COLORS.coral,
    borderRadius: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
});
