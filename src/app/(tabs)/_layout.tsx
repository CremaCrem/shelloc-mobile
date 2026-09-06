import { Tabs } from 'expo-router';
import { LayoutDashboard, Activity, Droplet, Bot } from 'lucide-react-native';
import { FloatingTabBar } from '@/components/core/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: 'Diagnostics',
          tabBarIcon: ({ color, size }) => <Activity size={size || 20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <Droplet size={size || 20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Insights',
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, size }) => <Bot size={size || 20} color={color} />,
        }}
      />
    </Tabs>
  );
}
