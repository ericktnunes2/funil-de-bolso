import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';
import { LeadsProvider } from '@/context/LeadsContext';

export default function RootLayout() {
  return (
    <LeadsProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: Colors.primaryDark,
          headerTitleAlign: 'center',
          headerTitleStyle: { color: Colors.text, fontWeight: '700', fontSize: 18 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          contentStyle: { backgroundColor: Colors.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="novo-lead" options={{ presentation: 'modal', title: 'Novo lead' }} />
        <Stack.Screen name="lead/[id]" options={{ title: 'Detalhe do lead', headerBackTitle: 'Voltar' }} />
      </Stack>
    </LeadsProvider>
  );
}
