import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';

/**
 * Custom floating tab bar with a glassmorphic translucent background.
 * Compatible with expo-router's Tabs component via the `tabBar` render prop.
 * 
 * The props type is inferred from expo-router; we use a loose typing
 * to avoid requiring @react-navigation/bottom-tabs as a direct dependency.
 */
interface FloatingTabBarProps {
  state: { routes: Array<{ key: string; name: string }>; index: number };
  descriptors: Record<string, { options: any }>;
  navigation: { emit: (e: any) => any; navigate: (name: string) => void };
}

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute.key]?.options;

  // If the active screen requested to hide the tab bar, do not render it
  if (currentOptions?.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 8 },
      ]}
      pointerEvents="box-none"
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.innerContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const icon = options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused ? '#FFFFFF' : '#64748B',
              size: 20,
            });

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                  styles.tab,
                  isFocused && styles.tabActive,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={typeof label === 'string' ? label : undefined}
              >
                {icon}
                {isFocused && typeof label === 'string' && (
                  <Typography
                    variant="caption"
                    color="ink"
                    className="font-semibold"
                    style={{ marginLeft: 6, fontSize: 11 }}
                  >
                    {label}
                  </Typography>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  blurContainer: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    maxWidth: 400,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  tabActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
});
