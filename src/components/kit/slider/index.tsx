import React, { useRef, useState } from "react";
import { FlatList, Dimensions, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { cn } from "~/lib/utils";

const { width, height } = Dimensions.get("window");

type AnimatedRenderItemProps<T> = {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onSwipeUp?: (item: T, index: number) => void;
  onSwipeDown?: (item: T, index: number) => void;
  isActive: boolean;
  className?: string;
};

function AnimatedRenderItem<T>({
  item,
  index,
  renderItem,
  onSwipeUp,
  onSwipeDown,
  isActive,
  className = "",
}: AnimatedRenderItemProps<T>) {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isActive) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (!isActive) return;
      if (event.translationY < -50 && onSwipeUp) {
        translateY.value = withSpring(-height, {}, () => {
          translateY.value = 0;
          runOnJS(onSwipeUp)(item, index);
        });
      } else if (event.translationY > 50 && onSwipeDown) {
        translateY.value = withSpring(height, {}, () => {
          translateY.value = 0;
          runOnJS(onSwipeDown)(item, index);
        });
      } else {
        translateY.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={animatedStyle}
        className={cn("flex-1 w-full items-center justify-center", className)}
      >
        {renderItem(item, index)}
      </Animated.View>
    </GestureDetector>
  );
}

type SliderProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
};

export function Slider<T>({
  items: initialItems,
  renderItem,
  className = "",
}: SliderProps<T>) {
  const [items, setItems] = useState(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<T>>(null);

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    // Corrige o índice se necessário
    setCurrentIndex((prev) => {
      if (index < prev) return prev - 1;
      if (prev >= items.length - 1) return Math.max(0, items.length - 2);
      return prev;
    });
  }

  function handleMomentumScrollEnd(ev: any) {
    const offset = ev.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }

  return (
    <FlatList
      ref={flatListRef}
      data={items}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, i) => String(i)}
      renderItem={({ item, index }) => (
        <View
          style={{ width, maxHeight: height }}
          className={cn("items-center justify-center", className)}
        >
          <AnimatedRenderItem
            item={item}
            index={index}
            renderItem={renderItem}
            onSwipeUp={(_, idx) => removeItem(idx)}
            onSwipeDown={(_, idx) => removeItem(idx)}
            isActive={index === currentIndex}
          />
        </View>
      )}
      snapToInterval={width}
      decelerationRate="fast"
      onMomentumScrollEnd={handleMomentumScrollEnd}
      getItemLayout={(_, i) => ({
        length: width,
        offset: width * i,
        index: i,
      })}
      className="flex-1"
    />
  );
}
