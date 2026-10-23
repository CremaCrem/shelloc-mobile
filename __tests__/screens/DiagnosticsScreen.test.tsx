import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DiagnosticsScreen from '../../src/app/(tabs)/diagnostics';
import { useTelemetry } from '../../src/hooks/useTelemetry';

// Mock expo-router
jest.mock('expo-router', () => {
  const mockPush = jest.fn();
  return {
    useRouter: () => ({ push: mockPush }),
    router: { push: mockPush },
  };
});

// Mock react-native-maps to prevent native module crashes
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  class MockMapView extends React.Component {
    animateToRegion() {}
    render() { return <View testID="map-view" {...this.props} />; }
  }
  const MockMarker = (props: any) => <View testID="map-marker" {...props} />;
  const MockCircle = (props: any) => <View testID="map-circle" {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Circle: MockCircle,
  };
});

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
    withSpring: jest.fn((val) => val),
    withTiming: jest.fn((val) => val),
    runOnJS: jest.fn((fn) => fn),
    default: {
      createAnimatedComponent: (Component: any) => Component,
      View: MockAnimatedView,
    },
  };
});

jest.mock('lucide-react-native', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (target, prop) => {
      return () => React.createElement('View', { testID: `icon-${prop as string}` });
    }
  });
});

// Mock the telemetry hook
jest.mock('../../src/hooks/useTelemetry', () => ({
  ...jest.requireActual('../../src/hooks/useTelemetry'),
  useTelemetry: jest.fn(),
}));

jest.mock('../../src/hooks/useTreatments', () => ({
  useTreatments: jest.fn(() => ({ data: [] })),
}));

jest.mock('../../src/hooks/useWaypoints', () => ({
  useWaypoints: jest.fn(() => ({ data: [] })),
}));

jest.mock('../../src/hooks/useDispatch', () => ({
  useDispatchRobot: () => ({ mutate: jest.fn() }),
}));

describe('DiagnosticsScreen Phase 5 - Map & Telemetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test_turtle_icon_telemetry_rendering: translates and rotates based on telemetry', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: {
        current_lat: 14.1234,
        current_lng: 120.5678,
        heading_degrees: 90,
      },
      isLoading: false,
      isError: false,
    });

    const { getAllByTestId } = render(<DiagnosticsScreen />);
    
    // Find the turtle marker (should be the last marker if waypoints were present, or the only one)
    const markers = getAllByTestId('map-marker');
    const turtleMarker = markers[markers.length - 1];
    
    expect(turtleMarker.props.coordinate.latitude).toBe(14.1234);
    expect(turtleMarker.props.coordinate.longitude).toBe(120.5678);
    expect(turtleMarker.props.rotation).toBe(90);
  });

  it('test_fab_navigation: pressing connected FAB navigates to manual override', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: { mission_state: 'idle' },
      isLoading: false,
      isError: false,
      isOnline: true,
      canTakeManualControl: true,
    });

    const { getByText } = render(<DiagnosticsScreen />);
    const fabLabel = getByText('Manual Override');
    
    fireEvent.press(fabLabel);
    
    const router = require('expo-router').router;
    expect(router.push).toHaveBeenCalledWith('/(modals)/manual-override');
  });

  it('test_fab_safety_disable: FAB is completely hidden/disabled when disconnected', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: { mission_state: 'idle' },
      isLoading: false,
      isError: true, // Simulating disconnect
    });

    const { getByText } = render(<DiagnosticsScreen />);
    fireEvent.press(getByText(/robot offline/i));
    const router = require('expo-router').router;
    expect(router.push).not.toHaveBeenCalled();
  });

  it('test_no_fake_values: missing readings, battery and position show "--", never placeholder numbers', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: undefined, isLoading: false, isError: true, isOnline: false, canTakeManualControl: false,
    });
    (useWaypoints as jest.Mock).mockReturnValue({
      data: [{ id: 'wp-1', point_number: 1, treated: false, latitude: 14.0, longitude: 120.0, radius_meters: 2 }],
    });

    const { queryByText, getAllByText, getByText, getAllByTestId } = render(<DiagnosticsScreen />);

    for (const fake of ['124.5', '5.20', '320', '28.5', '86%', 'GPS: Good', 'Floc: Ready']) {
      expect(queryByText(fake)).toBeNull();
    }
    expect(getAllByText('--').length).toBeGreaterThanOrEqual(8);
    expect(getByText('Vessel position: not reported')).toBeTruthy();
    // Only the waypoint marker — no robot marker at a made-up location
    expect(getAllByTestId('map-marker')).toHaveLength(1);
  });
});

import { useWaypoints } from '../../src/hooks/useWaypoints';

describe('DiagnosticsScreen Phase 6 - Sensor Telemetry & DO Cleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test_comparative_delta_calculation: calculates % delta correctly for normal reduction', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: {}, isLoading: false, isError: false,
    });
    
    // Simulate a selected waypoint with before and after readings
    (useWaypoints as jest.Mock).mockReturnValue({
      data: [{
        id: 'wp-1',
        point_number: 1,
        treated: true,
        latitude: 14.0, longitude: 120.0,
        before_reading: { tds_ppm: 400 },
        after_reading: { tds_ppm: 200 } // 50% reduction
      }]
    });

    const { getByText } = render(<DiagnosticsScreen />);
    
    // The delta is ((200 - 400) / 400) * 100 = -50.0
    // StatCard renders Math.abs(-50.0).toFixed(1) + '%'
    expect(getByText('50.0%')).toBeTruthy();
  });

  it('test_comparative_delta_calculation_edge_cases: zero before value and zero delta', () => {
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: {}, isLoading: false, isError: false,
    });
    
    // Simulate before = 0 (divide by zero edge case), and before = after case (0% delta)
    (useWaypoints as jest.Mock).mockReturnValue({
      data: [{
        id: 'wp-1',
        point_number: 1,
        treated: true,
        latitude: 14.0, longitude: 120.0,
        before_reading: { tds_ppm: 0, temperature: 25.0 },
        after_reading: { tds_ppm: 100, temperature: 25.0 }
      }]
    });

    const { getAllByText } = render(<DiagnosticsScreen />);
    
    // For TDS: before = 0. The code does: delta = before > 0 ? ... : 0. So delta should be 0.0%
    // For Temp: before = 25.0, after = 25.0. delta = (0 / 25.0) * 100 = 0.0%
    // We should see multiple "0.0%" rendered.
    const zeroDeltas = getAllByText('0.0%');
    expect(zeroDeltas.length).toBeGreaterThanOrEqual(1);
  });

  it('test_dissolved_oxygen_omission: DO is strictly ignored and not rendered', () => {
    // Provide telemetry containing DO
    (useTelemetry as jest.Mock).mockReturnValue({
      statusData: {
        dissolved_oxygen: 4.5,
        tds_ppm: 220,
        temperature: 28.1
      },
      isLoading: false,
      isError: false,
    });

    // Provide waypoint containing DO
    (useWaypoints as jest.Mock).mockReturnValue({
      data: [{
        id: 'wp-1',
        point_number: 1,
        treated: true,
        latitude: 14.0, longitude: 120.0,
        before_reading: { dissolved_oxygen: 3.9 },
        after_reading: { dissolved_oxygen: 4.5 }
      }]
    });

    const { queryByText, debug } = render(<DiagnosticsScreen />);
    
    // Assert that Dissolved Oxygen or DO is nowhere to be found
    const doLabel = queryByText(/Dissolved Oxygen/i);
    const doAbbrev = queryByText(/ DO /i);
    const doVal = queryByText('4.5');
    const doBefore = queryByText('3.9');
    
    expect(doLabel).toBeNull();
    expect(doAbbrev).toBeNull();
    // 4.5 and 3.9 should also not be rendered as metrics
    expect(doVal).toBeNull();
    expect(doBefore).toBeNull();
  });
});

