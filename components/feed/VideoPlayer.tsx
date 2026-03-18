import React, { useRef, useCallback, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Volume2, VolumeX } from "lucide-react-native";
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

  useEffect(() => {
    if (!videoRef.current) return;

    if (shouldPlay) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [shouldPlay]);

  const showMuteIndicator = useCallback(() => {
    muteIndicatorOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(600, withTiming(0, { duration: 300 }))
    );
  }, [muteIndicatorOpacity]);

  const handlePress = useCallback(() => {
    onToggleMute();
    showMuteIndicator();
  }, [onToggleMute, showMuteIndicator]);

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
      />

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
