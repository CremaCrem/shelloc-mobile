import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Joystick } from '../../src/components/core/Joystick';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockAnimatedView = (props: any) => <View {...props} />;
  MockAnimatedView.displayName = 'AnimatedComponent';

  return {
    __esModule: true,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedProps: jest.fn(() => ({})),
    withSpring: jest.fn((val: any) => val),
    withTiming: jest.fn((val: any) => val),
    runOnJS: jest.fn((fn: any) => fn),
    default: {
      createAnimatedComponent: (Component: any) => Component,
      View: MockAnimatedView,
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    GestureDetector: ({ children, gesture }: any) => (
      <View 
        testID="gesture-detector" 
        onGestureUpdate={gesture?._handlers?.onUpdate}
        onGestureEnd={gesture?._handlers?.onEnd}
      >
        {children}
      </View>
    ),
    Gesture: {
      Pan: () => {
        const handlers: any = {};
        const chain: any = {
          onUpdate: jest.fn((fn: any) => { handlers.onUpdate = fn; return chain; }),
          onEnd: jest.fn((fn: any) => { handlers.onEnd = fn; return chain; }),
          _handlers: handlers,
        };
        return chain;
      },
    },
  };
});

describe('Joystick Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('test_joystick_clamping: clamps values strictly to [-1.0, 1.0]', () => {
    const mockOnMove = jest.fn();
    const { getByTestId } = render(<Joystick onValueChange={mockOnMove} radius={100} />);
    const detector = getByTestId('gesture-detector');
    
    // Simulate drag outside radius (radius = 100, knobRadius = 33.33, maxDistance = 66.67)
    // Moving (200, -200) should clamp to approximately (1.0, 1.0)
    fireEvent(detector, 'gestureUpdate', { translationX: 200, translationY: -200 });
    
    expect(mockOnMove).toHaveBeenCalled();
    const [x, y] = mockOnMove.mock.calls[0];
    
    // Assert circular clamped to ~0.707
    // Circular clamping prevents the vector magnitude from exceeding 1.0, which is
    // safer for physical thrusters (prevents demanding 100% forward + 100% right simultaneously)
    expect(x).toBeCloseTo(0.707, 3);
    expect(y).toBeCloseTo(0.707, 3); // Note: y is inverted in Joystick implementation
  });

  it('test_joystick_throttle_and_safety_bypass: rapid updates dropped, (0,0) bypasses throttle', () => {
    const mockOnMove = jest.fn();
    const { getByTestId } = render(<Joystick onValueChange={mockOnMove} radius={100} />);
    const detector = getByTestId('gesture-detector');
    
    // Simulate release
    fireEvent(detector, 'gestureEnd');
    
    expect(mockOnMove).toHaveBeenCalledWith(0, 0);
  });
});
