import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import {
  ArrowLeft,
  Minus,
  Plus,
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { COLORS } from "@/lib/constants";
import { MOCK_RESTAURANTS } from "@/lib/mock-data";
import { ReservationStep } from "@/types";
import { useRestaurant } from "@/hooks/use-restaurants";
import { useCreateReservation } from "@/hooks/use-reservations";
import { useToastStore } from "@/stores/toast-store";

const STEPS: ReservationStep[] = ["date", "party", "time", "confirm", "success"];

const TIME_SLOTS = [
  { time: "5:00 PM", available: true },
  { time: "5:30 PM", available: true },
  { time: "6:00 PM", available: true },
  { time: "6:30 PM", available: false },
  { time: "7:00 PM", available: true },
  { time: "7:30 PM", available: true },
  { time: "8:00 PM", available: true },
  { time: "8:30 PM", available: false },
  { time: "9:00 PM", available: true },
  { time: "9:30 PM", available: true },
  { time: "10:00 PM", available: false },
  { time: "10:30 PM", available: true },
];

function formatDateLong(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatDateShort(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// ─── Step Indicator ────────────────────────────────────────────────────────

function StepIndicator({
  currentIndex,
  total,
}: {
  currentIndex: number;
  total: number;
}) {
  return (
    <View style={stepStyles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepStyles.dot,
            i <= currentIndex ? stepStyles.dotActive : stepStyles.dotInactive,
            i < currentIndex && stepStyles.dotCompleted,
          ]}
        />
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: COLORS.coral,
    width: 24,
  },
  dotInactive: {
    backgroundColor: COLORS.darkElevated,
  },
  dotCompleted: {
    backgroundColor: COLORS.success,
    width: 10,
  },
});

// ─── Date Step ─────────────────────────────────────────────────────────────

function DateStep({
  selectedDate,
  onDateChange,
  onNext,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onNext: () => void;
}) {
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (prev >= today) {
      onDateChange(prev);
    }
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    // Allow up to 30 days ahead
    const limit = new Date();
    limit.setDate(limit.getDate() + 30);
    if (next <= limit) {
      onDateChange(next);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stepContainer}>
      <View style={styles.stepIconRow}>
        <CalendarDays size={48} color={COLORS.coral} />
      </View>
      <Text style={styles.stepTitle}>Select a Date</Text>
      <Text style={styles.stepSubtitle}>
        Choose your preferred reservation date
      </Text>

      <View style={styles.dateSelector}>
        <Pressable onPress={handlePrevDay} style={styles.dateArrow} hitSlop={12}>
          <ChevronLeft size={28} color={COLORS.white} />
        </Pressable>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateDayName}>
            {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
          </Text>
          <Text style={styles.dateFullDate}>
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <Pressable onPress={handleNextDay} style={styles.dateArrow} hitSlop={12}>
          <ChevronRight size={28} color={COLORS.white} />
        </Pressable>
      </View>

      <Pressable onPress={onNext} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Party Size Step ───────────────────────────────────────────────────────

function PartyStep({
  partySize,
  onPartySizeChange,
  onNext,
}: {
  partySize: number;
  onPartySizeChange: (size: number) => void;
  onNext: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stepContainer}>
      <View style={styles.stepIconRow}>
        <Users size={48} color={COLORS.coral} />
      </View>
      <Text style={styles.stepTitle}>Party Size</Text>
      <Text style={styles.stepSubtitle}>How many guests?</Text>

      <View style={styles.stepper}>
        <Pressable
          onPress={() => onPartySizeChange(Math.max(1, partySize - 1))}
          style={[
            styles.stepperButton,
            partySize <= 1 && styles.stepperButtonDisabled,
          ]}
          disabled={partySize <= 1}
        >
          <Minus
            size={24}
            color={partySize <= 1 ? COLORS.textTertiary : COLORS.white}
          />
        </Pressable>
        <View style={styles.stepperValue}>
          <Text style={styles.stepperValueText}>{partySize}</Text>
          <Text style={styles.stepperValueLabel}>
            {partySize === 1 ? "Guest" : "Guests"}
          </Text>
        </View>
        <Pressable
          onPress={() => onPartySizeChange(Math.min(10, partySize + 1))}
          style={[
            styles.stepperButton,
            partySize >= 10 && styles.stepperButtonDisabled,
          ]}
          disabled={partySize >= 10}
        >
          <Plus
            size={24}
            color={partySize >= 10 ? COLORS.textTertiary : COLORS.white}
          />
        </Pressable>
      </View>

      <Pressable onPress={onNext} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Time Step ─────────────────────────────────────────────────────────────

function TimeStep({
  selectedTime,
  onTimeChange,
  onNext,
}: {
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  onNext: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stepContainer}>
      <View style={styles.stepIconRow}>
        <Clock size={48} color={COLORS.coral} />
      </View>
      <Text style={styles.stepTitle}>Select Time</Text>
      <Text style={styles.stepSubtitle}>Choose an available time slot</Text>

      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => (
          <Pressable
            key={slot.time}
            onPress={() => slot.available && onTimeChange(slot.time)}
            style={[
              styles.timeSlot,
              !slot.available && styles.timeSlotDisabled,
              selectedTime === slot.time && styles.timeSlotSelected,
            ]}
            disabled={!slot.available}
          >
            <Text
              style={[
                styles.timeSlotText,
                !slot.available && styles.timeSlotTextDisabled,
                selectedTime === slot.time && styles.timeSlotTextSelected,
              ]}
            >
              {slot.time}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={onNext}
        style={[
          styles.primaryButton,
          !selectedTime && styles.primaryButtonDisabled,
        ]}
        disabled={!selectedTime}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Confirm Step ──────────────────────────────────────────────────────────

function ConfirmStep({
  restaurant,
  date,
  partySize,
  time,
  specialRequests,
  onSpecialRequestsChange,
  onConfirm,
  isLoading,
}: {
  restaurant: { name: string };
  date: Date;
  partySize: number;
  time: string;
  specialRequests: string;
  onSpecialRequestsChange: (text: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Reservation</Text>
      <Text style={styles.stepSubtitle}>Review your booking details</Text>

      <View style={styles.confirmCard}>
        <Text style={styles.confirmRestaurantName}>{restaurant.name}</Text>
        <View style={styles.confirmDivider} />

        <View style={styles.confirmRow}>
          <CalendarDays size={20} color={COLORS.textSecondary} />
          <Text style={styles.confirmLabel}>Date</Text>
          <Text style={styles.confirmValue}>{formatDateShort(date)}</Text>
        </View>

        <View style={styles.confirmRow}>
          <Clock size={20} color={COLORS.textSecondary} />
          <Text style={styles.confirmLabel}>Time</Text>
          <Text style={styles.confirmValue}>{time}</Text>
        </View>

        <View style={styles.confirmRow}>
          <Users size={20} color={COLORS.textSecondary} />
          <Text style={styles.confirmLabel}>Party Size</Text>
          <Text style={styles.confirmValue}>
            {partySize} {partySize === 1 ? "Guest" : "Guests"}
          </Text>
        </View>
      </View>

      <Text style={styles.specialRequestsLabel}>Special Requests (optional)</Text>
      <TextInput
        style={styles.specialRequestsInput}
        value={specialRequests}
        onChangeText={onSpecialRequestsChange}
        placeholder="Dietary restrictions, occasions, seating preferences..."
        placeholderTextColor={COLORS.textTertiary}
        multiline
        numberOfLines={3}
        maxLength={200}
      />

      <Pressable
        onPress={onConfirm}
        disabled={isLoading}
        style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.primaryButtonText}>Confirm Reservation</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── Success Step ──────────────────────────────────────────────────────────

function SuccessStep({
  confirmationCode,
  onDone,
}: {
  confirmationCode: string;
  onDone: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={[styles.stepContainer, styles.successContainer]}
    >
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        style={styles.successIconWrapper}
      >
        <CheckCircle2 size={80} color={COLORS.success} />
      </Animated.View>

      <Text style={styles.successTitle}>Reservation Confirmed!</Text>
      <Text style={styles.successSubtitle}>
        Your table has been booked successfully
      </Text>

      <View style={styles.confirmationCodeBox}>
        <Text style={styles.confirmationCodeLabel}>Confirmation Code</Text>
        <Text style={styles.confirmationCodeValue}>{confirmationCode}</Text>
      </View>

      <Text style={styles.successNote}>
        You will receive a confirmation email shortly
      </Text>

      <Pressable onPress={onDone} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Done</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────

export default function ReserveScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: realRestaurant } = useRestaurant(slug);
  const restaurant =
    realRestaurant || MOCK_RESTAURANTS.find((r) => r.slug === slug) || null;

  const createReservation = useCreateReservation();
  const { showToast } = useToastStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  });
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [specialRequests, setSpecialRequests] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

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

  const step = STEPS[currentStep];

  const handleBack = () => {
    if (currentStep === 0 || step === "success") {
      router.back();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleConfirm = async () => {
    try {
      const result = await createReservation.mutateAsync({
        restaurantId: restaurant.id,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime!,
        partySize,
        specialRequests: specialRequests.trim() || undefined,
      });
      const code =
        (result as any)?.confirmation_code ||
        `RB-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
      setConfirmationCode(code);
      setCurrentStep(STEPS.indexOf("success"));
    } catch (err: any) {
      Alert.alert("Reservation Failed", err.message || "Please try again.");
    }
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
          <ArrowLeft size={24} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === "success" ? "Confirmed" : "Book a Table"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Step Indicator */}
      {step !== "success" && (
        <StepIndicator currentIndex={currentStep} total={STEPS.length - 1} />
      )}

      {/* Step Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === "date" && (
          <DateStep
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onNext={handleNext}
          />
        )}
        {step === "party" && (
          <PartyStep
            partySize={partySize}
            onPartySizeChange={setPartySize}
            onNext={handleNext}
          />
        )}
        {step === "time" && (
          <TimeStep
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            onNext={handleNext}
          />
        )}
        {step === "confirm" && (
          <ConfirmStep
            restaurant={restaurant}
            date={selectedDate}
            partySize={partySize}
            time={selectedTime!}
            specialRequests={specialRequests}
            onSpecialRequestsChange={setSpecialRequests}
            onConfirm={handleConfirm}
            isLoading={createReservation.isPending}
          />
        )}
        {step === "success" && (
          <SuccessStep
            confirmationCode={confirmationCode}
            onDone={handleDone}
          />
        )}
      </ScrollView>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Step Container
  stepContainer: {
    flex: 1,
    paddingTop: 24,
    gap: 12,
  },
  stepIconRow: {
    alignItems: "center",
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },

  // Date Step
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  dateArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDisplay: {
    alignItems: "center",
    flex: 1,
  },
  dateDayName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  dateFullDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Party Step
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.darkElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperValue: {
    alignItems: "center",
  },
  stepperValueText: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.white,
  },
  stepperValueLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Time Step
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32,
  },
  timeSlot: {
    width: "30%",
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  timeSlotDisabled: {
    opacity: 0.35,
  },
  timeSlotSelected: {
    borderColor: COLORS.coral,
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  timeSlotTextDisabled: {
    color: COLORS.textTertiary,
  },
  timeSlotTextSelected: {
    color: COLORS.coral,
  },

  // Confirm Step
  confirmCard: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 14,
  },
  confirmRestaurantName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  confirmDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.darkElevated,
    marginVertical: 4,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  confirmLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  confirmValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },

  // Success Step
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
  },
  successIconWrapper: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  confirmationCodeBox: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: "center",
    marginBottom: 16,
  },
  confirmationCodeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  confirmationCodeValue: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.coral,
    letterSpacing: 3,
  },
  successNote: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginBottom: 32,
  },

  // Special Requests
  specialRequestsLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 4,
  },
  specialRequestsInput: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.darkElevated,
    height: 90,
    textAlignVertical: "top",
  },

  // Buttons
  primaryButton: {
    backgroundColor: COLORS.coral,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
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
