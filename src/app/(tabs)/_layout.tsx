import { Tabs } from 'expo-router';
import { LayoutDashboard, Activity, Map, Droplet, Bot } from 'lucide-react-native';

export default function TabLayout() {
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
          height: 64,
          paddingBottom: 8,
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
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="treatments"
        options={{
          title: 'Treatments',
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
