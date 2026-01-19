import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function BankingLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="pix"
        options={{
          title: 'Pix',
        }}
      />
      <Stack.Screen
        name="pix-keys"
        options={{
          title: 'Minhas Chaves Pix',
        }}
      />
      <Stack.Screen
        name="pix-receive"
        options={{
          title: 'Receber Pix',
        }}
      />
      <Stack.Screen
        name="pix-scan"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="boletos"
        options={{
          title: 'Boletos',
        }}
      />
      <Stack.Screen
        name="boletos-history"
        options={{
          title: 'Histórico de Boletos',
        }}
      />
      <Stack.Screen
        name="boletos-dda"
        options={{
          title: 'DDA',
        }}
      />
      <Stack.Screen
        name="cards"
        options={{
          title: 'Cartões',
        }}
      />
      <Stack.Screen
        name="virtual-card"
        options={{
          title: 'Cartão Virtual',
        }}
      />
      <Stack.Screen
        name="cards-limit"
        options={{
          title: 'Ajustar Limite',
        }}
      />
      <Stack.Screen
        name="invest"
        options={{
          title: 'Investimentos',
        }}
      />
      <Stack.Screen
        name="statement"
        options={{
          title: 'Extrato',
        }}
      />
      <Stack.Screen
        name="deposit"
        options={{
          title: 'Depositar',
        }}
      />
      <Stack.Screen
        name="transfer"
        options={{
          title: 'Transferir',
        }}
      />
    </Stack>
  );
}
