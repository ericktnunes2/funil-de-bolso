import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function icone(ativo: IconName, inativo: IconName) {
  return ({ color, focused, size }: { color: any; focused: boolean; size: number }) => (
    <Ionicons name={focused ? ativo : inativo} size={size} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        // Sem altura fixa: o React Navigation soma a safe area inferior sozinho.
        tabBarStyle: { backgroundColor: Colors.card, borderTopColor: Colors.border, paddingTop: 6 },
        headerStyle: { backgroundColor: Colors.background },
        headerTitleAlign: 'center',
        headerTitleStyle: { color: Colors.text, fontWeight: '700', fontSize: 18 },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: Colors.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Funil', tabBarIcon: icone('funnel', 'funnel-outline') }} />
      <Tabs.Screen name="hoje" options={{ title: 'Hoje', tabBarIcon: icone('calendar', 'calendar-outline') }} />
      <Tabs.Screen name="resumo" options={{ title: 'Resumo', tabBarIcon: icone('bar-chart', 'bar-chart-outline') }} />
    </Tabs>
  );
}
