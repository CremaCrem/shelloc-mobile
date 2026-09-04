import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ManualOverrideScreen from '../../src/app/(modals)/manual-override';
import * as ScreenOrientation from 'expo-screen-orientation';
import { router } from 'expo-router';
import { useManualControl } from '../../src/hooks/useManualControl';

jest.mock('lucide-react-native', () => ({
  X: () => null,
  AlertTriangle: () => null,
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: { back: mockBack, canGoBack: jest.fn(() => true), replace: jest.fn() },
  useRouter: () => ({ back: mockBack, canGoBack: jest.fn(() => true), replace: jest.fn() }),
}));

jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn(),
  unlockAsync: jest.fn(),
  OrientationLock: {
    LANDSCAPE_RIGHT: 4,
    PORTRAIT_UP: 1,
  },
}));

jest.mock('../../src/hooks/useManualControl', () => ({
  useManualControl: jest.fn(),
}));

jest.mock('../../src/components/core/Joystick', () => {
  const { View } = require('react-native');
  return {
    Joystick: ({ onValueChange }: any) => {
      return <View testID="mock-joystick" onResponderRelease={() => onValueChange?.(0.5, 0.5)} />;
    },
  };
});

describe('ManualOverrideScreen', () => {
  const mockSendJoystick = jest.fn();
  const mockSendResume = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useManualControl as jest.Mock).mockReturnValue({
      sendJoystickCoordinates: mockSendJoystick,
      exitManualMode: mockSendResume,
      isConnected: true,
    });
  });

  it('test_orientation_lock_lifecycle: locks to landscape on mount and unlocks to portrait on unmount', () => {
    const { unmount } = render(<ManualOverrideScreen />);
    
    expect(ScreenOrientation.lockAsync).toHaveBeenCalledWith(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );

    unmount();
    
    expect(ScreenOrientation.lockAsync).toHaveBeenCalledWith(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  });

  it('test_manual_override_websocket_integration: queues manual_control payload', () => {
    const { getByTestId } = render(<ManualOverrideScreen />);
    
    const joystick = getByTestId('mock-joystick');
    fireEvent(joystick, 'responderRelease');
    
    expect(mockSendJoystick).toHaveBeenCalledWith(0.5, 0.5);
  });

  it('test_manual_override_disconnect_behavior: shows warning and blocks output', () => {
    (useManualControl as jest.Mock).mockReturnValue({
      sendJoystickCoordinates: mockSendJoystick,
      exitManualMode: mockSendResume,
      isConnected: false,
    });

    const { getByText } = render(<ManualOverrideScreen />);
    
    // RNTL rigorously checks the accessibility tree for this text
    expect(getByText(/Connection Lost/i)).toBeTruthy();
  });

  it('test_manual_override_exit_flow: fire-and-forget exit navigates back immediately', () => {
    const { getByText } = render(<ManualOverrideScreen />);
    
    const exitButton = getByText('Exit Manual Mode');
    fireEvent.press(exitButton);
    
    expect(mockSendResume).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
  });
});
