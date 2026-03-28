import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/config';

type TabIcon = React.ComponentProps<typeof Ionicons>['name'];

const tabs: { name: string; title: string; icon: TabIcon; iconFocused: TabIcon }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'gaming', title: 'Gaming', icon: 'game-controller-outline', iconFocused: 'game-controller' },
  { name: 'reviews', title: 'Reviews', icon: 'star-outline', iconFocused: 'star' },
  { name: 'guides', title: 'Guides', icon: 'book-outline', iconFocused: 'book' },
  { name: 'games', title: 'Games', icon: 'grid-outline', iconFocused: 'grid' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? tab.iconFocused : tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
