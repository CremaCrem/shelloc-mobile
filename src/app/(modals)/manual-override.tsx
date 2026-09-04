import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Joystick } from '../../components/core/Joystick';
import { useManualControl } from '../../hooks/useManualControl';
import { X } from 'lucide-react-native';

export default function ManualOverrideScreen() {
  const router = useRouter();
  const { sendJoystickCoordinates, exitManualMode, isConnected } = useManualControl();

  useEffect(() => {
    // Lock to landscape when mounted
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);

    return () => {
      // Revert to portrait (or default) when unmounted
      ScreenOrientation.unlockAsync();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const handleExit = () => {
    exitManualMode();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/diagnostics');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Override</Text>
        <Pressable style={styles.exitButton} onPress={handleExit}>
          <X size={24} color="#fff" />
          <Text style={styles.exitText}>Exit Manual Mode</Text>
        </Pressable>
      </View>
      
      {!isConnected && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>Connection Lost. Joystick Disabled.</Text>
        </View>
      )}

      <View style={styles.joystickContainer}>
        {isConnected ? (
          <Joystick onValueChange={sendJoystickCoordinates} radius={120} />
        ) : (
          <View testID="mock-joystick" style={{ width: 240, height: 240, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 120, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'red' }}>Disabled</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080D19',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.8)', // red-500
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exitText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  joystickContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    marginBottom: 20,
    alignItems: 'center',
  },
  warningText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
