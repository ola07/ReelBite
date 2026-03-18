import { Tabs } from "expo-router";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Flame, Search, Sparkles, ShoppingBag, User } from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

function TabBarIcon({ icon: Icon, focused }: { icon: any; focused: boolean }) {
  return (
    <Icon
      size={24}
      color={focused ? COLORS.coral : COLORS.textSecondary}
      strokeWidth={focused ? 2.5 : 1.75}
    />
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={80} tint="dark" style={styles.blurView}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;

            const icons: Record<string, any> = {
              feed: Flame,
              explore: Search,
              ai: Sparkles,
              orders: ShoppingBag,
              profile: User,
            };

            const Icon = icons[route.name] || Flame;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
              >
                <View style={[styles.tabIconContainer, isFocused && styles.tabIconActive]}>
                  <TabBarIcon icon={Icon} focused={isFocused} />
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? COLORS.coral : COLORS.textSecondary },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{ title: "Home", tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Explore", tabBarLabel: "Explore" }}
      />
      <Tabs.Screen
        name="ai"
        options={{ title: "AI", tabBarLabel: "AI" }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: "Orders", tabBarLabel: "Orders" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    backgroundColor: "transparent",
  },
  blurView: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  tabBar: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(10,10,10,0.75)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  tabIconContainer: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconActive: {
    backgroundColor: "rgba(16,185,129,0.15)",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
