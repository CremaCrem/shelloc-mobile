import { Tabs } from 'expo-router';
import { LayoutDashboard, Activity, Map, Droplet, Bot } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00F2FE', // Brand Cyan for active tab
        tabBarInactiveTintColor: '#64748B', // Muted slate for inactive tabs
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#151F32',
          borderTopColor: '#23334E',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 64 + insets.bottom : 68 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: 'Diagnostics',
          tabBarIcon: ({ color, size }) => <Activity size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity Log',
          tabBarIcon: ({ color, size }) => <Droplet size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Insights',
          tabBarIcon: ({ color, size }) => <Bot size={size || 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
