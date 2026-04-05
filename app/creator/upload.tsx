import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, Upload, VideoIcon, X, Search, MapPin } from "lucide-react-native";
import { COLORS, CUISINES } from "@/lib/constants";
import { MOCK_RESTAURANTS } from "@/lib/mock-data";
import { useUploadVideo } from "@/hooks/use-upload";
import { useToastStore } from "@/stores/toast-store";

export default function UploadScreen() {
  const router = useRouter();
  const uploadMutation = useUploadVideo();
  const { showToast } = useToastStore();

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  const selectedRestaurant = selectedRestaurantId
    ? MOCK_RESTAURANTS.find((r) => r.id === selectedRestaurantId)
    : null;

  const filteredRestaurants = restaurantSearch.trim()
    ? MOCK_RESTAURANTS.filter((r) =>
        r.name.toLowerCase().includes(restaurantSearch.toLowerCase())
      ).slice(0, 6)
    : [];

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.8,
      videoMaxDuration: 120,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : prev.length < 3
        ? [...prev, cuisine]
        : prev
    );
  };

  const handleUpload = async () => {
    if (!videoUri) return Alert.alert("Select a video first");
    if (!title.trim()) return Alert.alert("Enter a title");

    try {
      await uploadMutation.mutateAsync({
        uri: videoUri,
        title: title.trim(),
        description: description.trim() || undefined,
        cuisineTags: selectedCuisines.length > 0 ? selectedCuisines : undefined,
        restaurantId: selectedRestaurantId || undefined,
      });
      showToast("Video uploaded successfully!", "success");
      router.back();
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={24} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Upload Video</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Video Picker */}
        {videoUri ? (
          <View style={styles.previewContainer}>
            <Video
              source={{ uri: videoUri }}
              style={styles.preview}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              useNativeControls
            />
            <Pressable style={styles.removeBtn} onPress={() => setVideoUri(null)}>
              <X size={18} color={COLORS.white} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.pickButton} onPress={pickVideo}>
            <VideoIcon size={40} color={COLORS.textSecondary} strokeWidth={1.5} />
            <Text style={styles.pickText}>Tap to select a video</Text>
            <Text style={styles.pickSubtext}>Max 2 minutes</Text>
          </Pressable>
        )}

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Give your video a title"
          placeholderTextColor={COLORS.textTertiary}
          maxLength={100}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="What's this video about?"
          placeholderTextColor={COLORS.textTertiary}
          multiline
          numberOfLines={3}
          maxLength={500}
        />

        {/* Cuisine Tags */}
        <Text style={styles.label}>Cuisine Tags (up to 3)</Text>
        <View style={styles.tagsContainer}>
          {CUISINES.slice(0, 12).map((cuisine) => (
            <Pressable
              key={cuisine}
              style={[
                styles.tag,
                selectedCuisines.includes(cuisine) && styles.tagSelected,
              ]}
              onPress={() => toggleCuisine(cuisine)}
            >
              <Text
                style={[
                  styles.tagText,
                  selectedCuisines.includes(cuisine) && styles.tagTextSelected,
                ]}
              >
                {cuisine}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Restaurant Tag */}
        <Text style={styles.label}>Tag a Restaurant (optional)</Text>
        {selectedRestaurant ? (
          <View style={styles.selectedRestaurant}>
            <MapPin size={14} color={COLORS.coral} />
            <Text style={styles.selectedRestaurantName}>{selectedRestaurant.name}</Text>
            <Pressable
              onPress={() => {
                setSelectedRestaurantId(null);
                setRestaurantSearch("");
              }}
              hitSlop={8}
            >
              <X size={16} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.searchRow}>
              <Search size={16} color={COLORS.textTertiary} />
              <TextInput
                style={styles.searchInput}
                value={restaurantSearch}
                onChangeText={setRestaurantSearch}
                placeholder="Search restaurants..."
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>
            {filteredRestaurants.length > 0 && (
              <View style={styles.restaurantList}>
                {filteredRestaurants.map((r) => (
                  <Pressable
                    key={r.id}
                    style={styles.restaurantOption}
                    onPress={() => {
                      setSelectedRestaurantId(r.id);
                      setRestaurantSearch("");
                    }}
                  >
                    <MapPin size={14} color={COLORS.textTertiary} />
                    <Text style={styles.restaurantOptionName}>{r.name}</Text>
                    <Text style={styles.restaurantOptionCuisine}>{r.cuisine_type}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 20 }} />

        {/* Upload Button */}
        <Pressable
          style={[
            styles.uploadButton,
            (!videoUri || !title.trim() || uploadMutation.isPending) &&
              styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={!videoUri || !title.trim() || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Upload size={20} color={COLORS.white} strokeWidth={2} />
              <Text style={styles.uploadButtonText}>Upload Video</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  pickButton: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.darkHover,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    marginBottom: 24,
  },
  pickText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  pickSubtext: {
    color: COLORS.textTertiary,
    fontSize: 13,
    marginTop: 4,
  },
  previewContainer: {
    borderRadius: 16,
    overflow: "hidden",
    height: 280,
    marginBottom: 24,
    backgroundColor: COLORS.darkSurface,
  },
  preview: {
    flex: 1,
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.darkHover,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.darkSurface,
    borderWidth: 1,
    borderColor: COLORS.darkHover,
  },
  tagSelected: {
    backgroundColor: COLORS.coral,
    borderColor: COLORS.coral,
  },
  tagText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  tagTextSelected: {
    color: COLORS.white,
  },
  uploadButton: {
    backgroundColor: COLORS.coral,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  // Restaurant picker
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.darkHover,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  restaurantList: {
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.darkHover,
    overflow: "hidden",
    marginBottom: 4,
  },
  restaurantOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.darkElevated,
  },
  restaurantOptionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  restaurantOptionCuisine: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  selectedRestaurant: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.coral,
    marginBottom: 4,
  },
  selectedRestaurantName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.coral,
  },
});
