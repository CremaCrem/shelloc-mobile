import { renderHook, act } from '@testing-library/react-native';
import { parseServerTime, formatAgo } from '../../src/hooks/useTelemetry';
import { useManualControl } from '../../src/hooks/useManualControl';

describe('server time parsing', () => {
  it('reads timezone-less server times as UTC, not phone-local time', () => {
    expect(parseServerTime('2026-10-23T10:00:00.123000')).toBe(Date.UTC(2026, 9, 23, 10, 0, 0, 123));
    expect(parseServerTime('2026-10-23T10:00:00Z')).toBe(Date.UTC(2026, 9, 23, 10, 0, 0));
    expect(parseServerTime('2026-10-23T18:00:00+08:00')).toBe(Date.UTC(2026, 9, 23, 10, 0, 0));
    expect(parseServerTime(undefined)).toBeNull();
    expect(parseServerTime('garbage')).toBeNull();
  });

  it('formats "last seen"', () => {
    expect(formatAgo(null)).toBe('Never');
    expect(formatAgo(3)).toBe('Just now');
    expect(formatAgo(45)).toBe('45s ago');
    expect(formatAgo(125)).toBe('2 min ago');
  });
});

describe('joystick keep-alive', () => {
  const sent: any[] = [];

  beforeEach(() => {
    jest.useFakeTimers();
    sent.length = 0;
    (globalThis as any).WebSocket = class {
      static OPEN = 1;
      readyState = 1;
      send(msg: string) { sent.push(JSON.parse(msg)); }
      close() {}
    };
  });

  afterEach(() => jest.useRealTimers());

  it('repeats a held stick position so the robot failsafe (500ms) does not cut the motors', () => {
    const { result, unmount } = renderHook(() => useManualControl());

    act(() => result.current.sendJoystickCoordinates(0.5, 0.8));
    act(() => { jest.advanceTimersByTime(1000); });
    const held = sent.filter((m) => m.event === 'manual_control' && m.data.y === 0.8);
    expect(held.length).toBeGreaterThanOrEqual(5);

    // Releasing the stick stops the repeats
    act(() => result.current.sendJoystickCoordinates(0, 0));
    const countAfterRelease = sent.length;
    act(() => { jest.advanceTimersByTime(1000); });
    expect(sent.length).toBe(countAfterRelease);

    unmount();
  });
});
