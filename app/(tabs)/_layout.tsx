import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/constants/theme';

const icon = (name: any) => (p: any) => <Ionicons name={name} {...p} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.bg,
          borderTopColor: C.line,
          borderTopWidth: 1,
          height: 84,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: C.champagne,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.42)',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          paddingBottom: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="campaigns" options={{ title: 'Campaigns', tabBarIcon: icon('navigate-outline') }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings', tabBarIcon: icon('wallet-outline') }} />
      <Tabs.Screen name="vehicle" options={{ title: 'Vehicle', tabBarIcon: icon('car-sport-outline') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline') }} />
    </Tabs>
  );
}
