import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { Platform, BackHandler } from 'react-native';

// Polyfill para BackHandler.removeEventListener (removido no React Native 0.73+)
// Necessário para compatibilidade com a biblioteca NativeBase
if (Platform.OS !== 'web' && BackHandler && !(BackHandler as any).removeEventListener) {
  const originalAddEventListener = BackHandler.addEventListener;
  const handlers = new Map();

  // @ts-ignore
  BackHandler.addEventListener = (eventName, handler) => {
    const subscription = originalAddEventListener(eventName, handler);
    handlers.set(handler, subscription);
    return subscription;
  };

  // @ts-ignore
  BackHandler.removeEventListener = (eventName, handler) => {
    const subscription = handlers.get(handler);
    if (subscription) {
      subscription.remove();
      handlers.delete(handler);
    } else {
      // Caso o handler não esteja no mapa, tentamos apenas um log ou ignoramos
      // Algumas bibliotecas podem tentar remover um listener que nunca foi adicionado via nosso polyfill
    }
  };
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { store, persistor } from '../store';

const queryClient = new QueryClient();
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Correção para o erro outlineWidth no React Native 0.71+
const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: {
          borderWidth: 0, // Botões geralmente não precisam de borda de foco no mobile
        },
      },
    },
  },
});

export const unstable_settings = {
  initialRouteName: 'login',

};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <NativeBaseProvider theme={theme}>
            <SafeAreaProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack initialRouteName='login'>
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="register" options={{ headerShown: false }} />
                  <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                  <Stack.Screen name="cart" options={{ headerShown: false }} />
                  <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="reset-password" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </SafeAreaProvider>
          </NativeBaseProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
