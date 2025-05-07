import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import Colors from "@/constants/colors";

interface ImageGalleryProps {
  images: string[];
}

const { width } = Dimensions.get("window");
const imageWidth = width;
const thumbnailWidth = 60;

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / imageWidth);
    setActiveIndex(newIndex);
  };

  const handleThumbnailPress = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * imageWidth,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.imageContainer}
      >
        {images.map((image, index) => (
          <Image
            key={`image-${index}`}
            source={{ uri: image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailContainer}
        contentContainerStyle={styles.thumbnailContent}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={`thumb-${index}`}
            onPress={() => handleThumbnailPress(index)}
            style={[
              styles.thumbnailWrapper,
              index === activeIndex && styles.thumbnailWrapperActive,
            ]}
          >
            <Image
              source={{ uri: image }}
              style={styles.thumbnail}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageContainer: {
    width: imageWidth,
    height: 250,
  },
  image: {
    width: imageWidth,
    height: 250,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  thumbnailContainer: {
    marginTop: 8,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
  },
  thumbnailWrapper: {
    width: thumbnailWidth,
    height: thumbnailWidth,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailWrapperActive: {
    borderColor: Colors.primary,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
});