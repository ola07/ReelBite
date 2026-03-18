import React, { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  useWindowDimensions,
  Platform,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/lib/constants";
import { MOCK_VIDEOS, VIDEO_COMMUNITY_BADGES, VIDEO_REVIEWS, CREATOR_TIERS } from "@/lib/mock-data";
import { useFeedStore } from "@/stores/feed-store";
import type { VideoWithDetails } from "@/types";
import VideoCard from "@/components/feed/VideoCard";
import FeedCategories, { FeedCategory } from "@/components/feed/FeedCategories";
import CommunityBadge from "@/components/feed/CommunityBadge";
import ReviewCard from "@/components/feed/ReviewCard";
import CriticBadge from "@/components/creator/CriticBadge";

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 90 : 80;

export default function FeedScreen() {
  const { width, height } = useWindowDimensions();
  const cardHeight = height - TAB_BAR_HEIGHT;

  const { isMuted, toggleMute, currentIndex, setCurrentIndex } = useFeedStore();

  const [videos, setVideos] = useState<VideoWithDetails[]>(MOCK_VIDEOS);
  const [activeCategory, setActiveCategory] = useState<FeedCategory>("for_you");

  const filteredVideos = React.useMemo(() => {
    switch (activeCategory) {
      case "trending":
        return [...videos].sort((a, b) => b.engagement_score - a.engagement_score);
      case "near_me":
        // In real app, sort by geo proximity. For now, reverse order as mock.
        return [...videos].reverse();
      case "following":
        return videos.filter((v) => v.creator.is_verified);
      case "for_you":
      default:
        return videos;
    }
  }, [videos, activeCategory]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleLike = useCallback(
    (videoId: string) => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                is_liked: !v.is_liked,
                like_count: v.is_liked ? v.like_count - 1 : v.like_count + 1,
              }
            : v
        )
      );
    },
    []
  );

  const handleBookmark = useCallback(
    (videoId: string) => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId
            ? {
                ...v,
                is_bookmarked: !v.is_bookmarked,
                bookmark_count: v.is_bookmarked
                  ? v.bookmark_count - 1
                  : v.bookmark_count + 1,
              }
            : v
        )
      );
    },
    []
  );

  const handleComment = useCallback((_videoId: string) => {}, []);
  const handleShare = useCallback((_videoId: string) => {}, []);
  const handlePressRestaurant = useCallback((_restaurantId: string) => {}, []);
  const handlePressCreator = useCallback((_creatorId: string) => {}, []);

  const renderItem = useCallback(
    ({ item, index }: { item: VideoWithDetails; index: number }) => {
      const badge = VIDEO_COMMUNITY_BADGES[item.id];
      const review = VIDEO_REVIEWS[item.id];
      const creatorTier = CREATOR_TIERS[item.creator_id];

      return (
        <View style={{ height: cardHeight, width }}>
          <VideoCard
            video={item}
            isActive={index === currentIndex}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onLike={handleLike}
            onComment={handleComment}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onPressRestaurant={handlePressRestaurant}
            onPressCreator={handlePressCreator}
          />
          {/* Community Badge + Critic Tier Overlay */}
          <View style={styles.badgeOverlay}>
            {badge && <CommunityBadge type={badge} />}
            {creatorTier && <CriticBadge tier={creatorTier} />}
          </View>
          {/* Review Card Overlay */}
          {review && (
            <View style={styles.reviewOverlay}>
              <ReviewCard
                rating={review.rating}
                title={review.title}
                body={review.body}
                authorName={review.authorName}
                date={review.date}
              />
            </View>
          )}
        </View>
      );
    },
    [
      cardHeight,
      width,
      currentIndex,
      isMuted,
      toggleMute,
      handleLike,
      handleComment,
      handleBookmark,
      handleShare,
      handlePressRestaurant,
      handlePressCreator,
    ]
  );

  const keyExtractor = useCallback((item: VideoWithDetails) => item.id, []);

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: cardHeight,
      offset: cardHeight * index,
      index,
    }),
    [cardHeight]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={filteredVideos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        pagingEnabled
        snapToAlignment="start"
        snapToInterval={cardHeight}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />

      {/* Top header overlay */}
      <View style={styles.headerOverlay} pointerEvents="box-none">
        <Text style={styles.logoText}>ReelBite</Text>
        <View style={styles.categoriesRow}>
          <FeedCategories
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === "ios" ? 56 : 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    opacity: 0.9,
    marginBottom: 8,
  },
  categoriesRow: {
    marginLeft: -16,
    marginRight: -16,
  },
  badgeOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 94,
    left: 16,
    zIndex: 12,
    flexDirection: "row",
    gap: 6,
  },
  reviewOverlay: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 200 : 180,
    left: 16,
    zIndex: 12,
  },
});
