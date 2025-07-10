import React, { useEffect } from "react";
import { Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

function clamp(val: number, min: number, max: number) {
  "worklet";
  return Math.max(min, Math.min(val, max));
}

export type SwiperProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onSwipeLeft?: (item: T, index: number) => void;
  onSwipeRight?: (item: T, index: number) => void;
  onSwipeUp?: (item: T, index: number) => void;
  onSwipeDown?: (item: T, index: number) => void;
  swipeThresholdX?: number;
  swipeThresholdY?: number;
  renderOverlay?: (params: { currentIndex: number; lockedAxis: "x" | "y" | null }) => React.ReactNode;
  maxSwipeX?: number;
  maxSwipeY?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  onEndReached?: () => void;
  hasMoreItems?: boolean;
  endReachedThreshold?: number;
  dimensions?: {
    width?: number;
    height?: number;
  };
};

export function Swiper<T>({
  items = [],
  renderItem,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThresholdX = width * 0.25,
  swipeThresholdY = height * 0.18,
  maxSwipeX = width * 0.15,
  maxSwipeY = height * 0.1,
  renderOverlay,
  index = 0,
  onIndexChange = () => {},
  onEndReached,
  hasMoreItems = true,
  endReachedThreshold = 2,
  dimensions = {
    width,
    height: height * 0.6,
  }
}: SwiperProps<T>) {
  const [lockedAxis, setLockedAxis] = React.useState<"x" | "y" | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const nextCardScale = useSharedValue(0.95);
  const nextCardOpacity = useSharedValue(0.7);

  // Sincroniza o índice externo com o tamanho do array ao carregar mais itens
  useEffect(() => {
    if (index > items.length - 1 && items.length > 0) {
      onIndexChange(items.length - 1);
    }
  }, [items?.length, index, onIndexChange]);

  const canSwipeLeft = !!onSwipeLeft;
  const canSwipeRight = !!onSwipeRight;
  const canSwipeUp = !!onSwipeUp;
  const canSwipeDown = !!onSwipeDown;

  const handleSetLockedAxis = (axis: "x" | "y") => setLockedAxis(axis);
  const handleResetLockedAxis = () => setLockedAxis(null);

  const handleSwipe = (direction: "left" | "right" | "up" | "down") => {
    const item = items[index];
    if (direction === "left" && onSwipeLeft) onSwipeLeft(item, index);
    if (direction === "right" && onSwipeRight) {
      onSwipeRight(item, index);

      const nextIndex = index + 1;
      if (
        onEndReached &&
        hasMoreItems &&
        items.length > 0 &&
        nextIndex >= items.length - endReachedThreshold
      ) {
        onEndReached();
      }
    }
    if (direction === "up" && onSwipeUp) onSwipeUp(item, index);
    if (direction === "down" && onSwipeDown) onSwipeDown(item, index);

    setLockedAxis(null);
    translateX.value = 0;
    translateY.value = 0;
    nextCardScale.value = 0.95;
    nextCardOpacity.value = 0.7;
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(handleResetLockedAxis)();
    })
    .onUpdate((event) => {
      if (!lockedAxis) {
        if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
          if (event.translationX > 0 && canSwipeRight) {
            runOnJS(handleSetLockedAxis)("x");
          } else if (event.translationX < 0 && canSwipeLeft) {
            runOnJS(handleSetLockedAxis)("x");
          } else if (canSwipeUp || canSwipeDown) {
            runOnJS(handleSetLockedAxis)("y");
          }
        } else if (Math.abs(event.translationY) > Math.abs(event.translationX)) {
          if (event.translationY < 0 && canSwipeUp) {
            runOnJS(handleSetLockedAxis)("y");
          } else if (event.translationY > 0 && canSwipeDown) {
            runOnJS(handleSetLockedAxis)("y");
          } else if (canSwipeLeft || canSwipeRight) {
            runOnJS(handleSetLockedAxis)("x");
          }
        }
      }

      if (lockedAxis === "x") {
        if (
          (event.translationX > 0 && canSwipeRight) ||
          (event.translationX < 0 && canSwipeLeft)
        ) {
          translateX.value = clamp(event.translationX, -maxSwipeX, maxSwipeX);
        } else {
          translateX.value = 0;
        }
        translateY.value = 0;
      } else if (lockedAxis === "y") {
        if (
          (event.translationY < 0 && canSwipeUp) ||
          (event.translationY > 0 && canSwipeDown)
        ) {
          translateY.value = clamp(event.translationY, -maxSwipeY, maxSwipeY);
        } else {
          translateY.value = 0;
        }
        translateX.value = 0;
      } else {
        translateX.value = 0;
        translateY.value = 0;
      }

      const progress =
        lockedAxis === "x"
          ? Math.abs(translateX.value) / swipeThresholdX
          : Math.abs(translateY.value) / swipeThresholdY;
      nextCardScale.value = 0.95 + Math.min(progress, 1) * 0.05;
      nextCardOpacity.value = 0.7 + Math.min(progress, 1) * 0.3;
    })
    .onEnd((event) => {
      let swiped = false;
      if (lockedAxis === "x") {
        if (event.translationX > swipeThresholdX && canSwipeRight) {
          swiped = true;
          translateX.value = withSpring(width, { damping: 10, stiffness: 200 });
          runOnJS(handleSwipe)("right");
        } else if (event.translationX < -swipeThresholdX && canSwipeLeft) {
          swiped = true;
          translateX.value = withSpring(-width, { damping: 10, stiffness: 200 });
          runOnJS(handleSwipe)("left");
        }
      } else if (lockedAxis === "y") {
        if (event.translationY < -swipeThresholdY && canSwipeUp) {
          swiped = true;
          translateY.value = withSpring(-height, { damping: 10, stiffness: 200 });
          runOnJS(handleSwipe)("up");
        } else if (event.translationY > swipeThresholdY && canSwipeDown) {
          swiped = true;
          translateY.value = withSpring(height, { damping: 10, stiffness: 200 });
          runOnJS(handleSwipe)("down");
        }
      }
      if (!swiped) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        nextCardScale.value = withTiming(0.95);
        nextCardOpacity.value = withTiming(0.7);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${lockedAxis === "x" ? translateX.value / 20 : 0}deg` },
    ],
    zIndex: 2,
  }));

  const nextCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextCardScale.value }],
    opacity: nextCardOpacity.value,
    position: "absolute",
    zIndex: 1,
    ...dimensions,
  }));

  if (index >= items.length) {
    return (
      <GestureHandlerRootView className="items-center justify-center flex-1">
        <Text className="text-lg text-gray-400">Fim dos cards!</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="items-center justify-center flex-1">
      {items[index + 1] && (
        <Animated.View
          style={nextCardAnimatedStyle}
          pointerEvents="none"
        >
          {renderItem(items[index + 1], index + 1)}
        </Animated.View>
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            dimensions,
            animatedStyle,
          ]}
        >
          {renderItem(items[index], index)}
          {renderOverlay && renderOverlay({ currentIndex: index, lockedAxis })}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}