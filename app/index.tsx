import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { COLORS } from "@/lib/constants";

export default function Index() {
  const { session, isLoading } = useAuthStore();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    useOnboardingStore.getState().checkCompleted().then((done) => {
      setOnboardingDone(done);
      setOnboardingChecked(true);
    });
  }, []);

  if (isLoading || !onboardingChecked) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.coral} />
      </View>
    );
  }

  // First time user → onboarding quiz
  if (!onboardingDone) {
    return <Redirect href={"/onboarding" as any} />;
  }

  // Not logged in → auth
  if (!session) {
    return <Redirect href="/auth/welcome" />;
  }

  // Logged in → feed
  return <Redirect href="/(tabs)/feed" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },
});
