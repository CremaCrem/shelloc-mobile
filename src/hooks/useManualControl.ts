import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useManualControl() {
  const activeRobotId = useAppStore((state) => state.activeRobotId);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSendTimeRef = useRef<number>(0);
  const [isConnected, setIsConnected] = useState(true); // Assume connected until error/close

  useEffect(() => {
    if (!activeRobotId) return;

    const wsUrl = `${process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/robot/${activeRobotId}?role=mobile`;
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

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [activeRobotId]);

  const sendJoystickCoordinates = useCallback((x: number, y: number) => {
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
