import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/src/constants/theme';

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  function TabIcon({ color, size }: { color: string; size: number }) {
    return <Ionicons name={name} color={color} size={size} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.bg },
        tabBarStyle: {
          backgroundColor: C.bgSoft,
          borderTopColor: C.line,
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 14,
        },
        tabBarActiveTintColor: C.paper,
        tabBarInactiveTintColor: C.muted2,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Today', tabBarIcon: icon('sunny-outline') }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{ title: 'Work', tabBarIcon: icon('briefcase-outline') }}
      />
      <Tabs.Screen
        name="stock"
        options={{ title: 'Stock', tabBarIcon: icon('cube-outline') }}
      />
      <Tabs.Screen
        name="report"
        options={{ title: 'Routes', tabBarIcon: icon('map-outline') }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: icon('person-outline') }}
      />
      {/* Keep old routes reachable during transition but hidden from tab bar */}
      <Tabs.Screen name="earnings" options={{ href: null }} />
      <Tabs.Screen name="vehicle" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
