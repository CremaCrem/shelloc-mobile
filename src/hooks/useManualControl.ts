import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useAppStore } from '../store/useAppStore';

// Android emulator cannot reach host via localhost — use 10.0.2.2 instead
const resolveLocalUrl = (url: string) => {
  if (Platform.OS === 'android') {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

export function useManualControl() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSendTimeRef = useRef<number>(0);
  const lastValueRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!activeRobotId) return;

    const rawWsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000';
    const wsUrl = `${resolveLocalUrl(rawWsUrl)}/ws/robot/${activeRobotId}?role=mobile`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Manual Control WebSocket connected');
      setIsConnected(true);
    };

    ws.onerror = (e) => {
      console.error('Manual Control WebSocket error', e);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Manual Control WebSocket closed');
      setIsConnected(false);
    };

    wsRef.current = ws;

    // The robot stops its motors if it hears nothing for 500ms, and a stick held
    // still sends no new gesture events — so repeat the last non-zero position.
    const keepAlive = setInterval(() => {
      const { x, y } = lastValueRef.current;
      if ((x !== 0 || y !== 0) && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'manual_control', data: { x, y } }));
        lastSendTimeRef.current = Date.now();
      }
    }, 200);

    return () => {
      clearInterval(keepAlive);
      ws.close();
      wsRef.current = null;
    };
  }, [activeRobotId]);

  const sendJoystickCoordinates = useCallback((x: number, y: number) => {
    lastValueRef.current = { x, y };
    const now = Date.now();
    // Throttle to ~10Hz (100ms), but (0,0) stop command instantly bypasses throttle
    if (now - lastSendTimeRef.current < 100 && (x !== 0 || y !== 0)) {
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: 'manual_control',
          data: { x, y },
        })
      );
      lastSendTimeRef.current = now;
    }
  }, []);

  const exitManualMode = useCallback(() => {
    lastValueRef.current = { x: 0, y: 0 };
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          event: 'resume_autonomous',
        })
      );
    }
  }, []);

  return { sendJoystickCoordinates, exitManualMode, isConnected };
}
