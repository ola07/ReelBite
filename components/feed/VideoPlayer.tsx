import React, { useRef, useCallback, useEffect, useState } from "react";
import { StyleSheet, Pressable, View, ActivityIndicator, Text } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Volume2, VolumeX, AlertCircle, RefreshCw } from "lucide-react-native";
import { COLORS } from "@/lib/constants";

interface VideoPlayerProps {
  videoUrl: string;
  shouldPlay: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function VideoPlayer({
  videoUrl,
  shouldPlay,
  isMuted,
  onToggleMute,
}: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const muteIndicatorOpacity = useSharedValue(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (shouldPlay) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [shouldPlay]);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering);
      setHasError(false);
    } else if (status.error) {
      setHasError(true);
      setIsBuffering(false);
    }
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsBuffering(false);
  }, []);

  const handleRetry = useCallback(async () => {
    setHasError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      await videoRef.current.unloadAsync();
      await videoRef.current.loadAsync({ uri: videoUrl }, { shouldPlay });
    }
  }, [videoUrl, shouldPlay]);

  const showMuteIndicator = useCallback(() => {
    muteIndicatorOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(600, withTiming(0, { duration: 300 }))
    );
  }, [muteIndicatorOpacity]);

  const handlePress = useCallback(() => {
    if (hasError) {
      handleRetry();
      return;
    }
    onToggleMute();
    showMuteIndicator();
  }, [onToggleMute, showMuteIndicator, hasError, handleRetry]);

  const muteIndicatorStyle = useAnimatedStyle(() => ({
    opacity: muteIndicatorOpacity.value,
  }));

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={shouldPlay}
        isMuted={isMuted}
        isLooping
        useNativeControls={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={handleError}
      />

      {/* Buffering indicator */}
      {isBuffering && !hasError && (
        <View style={styles.bufferingOverlay}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      )}

      {/* Error state */}
      {hasError && (
        <View style={styles.errorOverlay}>
          <AlertCircle size={32} color={COLORS.textSecondary} />
          <Text style={styles.errorText}>Video failed to load</Text>
          <Pressable style={styles.retryBtn} onPress={handleRetry}>
            <RefreshCw size={16} color={COLORS.white} />
            <Text style={styles.retryText}>Tap to retry</Text>
          </Pressable>
        </View>
      )}

      {/* Mute indicator */}
      <Animated.View style={[styles.muteIndicator, muteIndicatorStyle]}>
        <View style={styles.muteIndicatorBackground}>
          {isMuted ? (
            <VolumeX size={20} color={COLORS.white} strokeWidth={2} />
          ) : (
            <Volume2 size={20} color={COLORS.white} strokeWidth={2} />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.dark,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.darkSurface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  muteIndicator: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 10,
  },
  muteIndicatorBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
});
