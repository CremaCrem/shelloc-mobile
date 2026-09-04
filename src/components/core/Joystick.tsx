import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface JoystickProps {
  onValueChange?: (x: number, y: number) => void;
  radius?: number;
}

export function Joystick({ onValueChange, radius = 100 }: JoystickProps) {
  const knobRadius = radius / 3;
  const maxDistance = radius - knobRadius;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const updateValue = (tx: number, ty: number) => {
    if (onValueChange) {
      // Normalize to [-1.0, 1.0]
      // x is positive right, negative left
      // y is positive up (forward), negative down (backward).
      let normalizedX = tx / maxDistance;
      let normalizedY = -ty / maxDistance;

      // Normalize floating point -0 to 0 to prevent downstream serialization artifacts
      normalizedX = normalizedX === 0 ? 0 : normalizedX;
      normalizedY = normalizedY === 0 ? 0 : normalizedY;

      onValueChange(normalizedX, normalizedY);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      if (distance <= maxDistance) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      } else {
        translateX.value = (event.translationX / distance) * maxDistance;
        translateY.value = (event.translationY / distance) * maxDistance;
      }
      runOnJS(updateValue)(translateX.value, translateY.value);
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(updateValue)(0, 0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
        },
      ]}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.knob,
            {
              width: knobRadius * 2,
              height: knobRadius * 2,
              borderRadius: knobRadius,
            },
            animatedStyle,
          ]}
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  knob: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
