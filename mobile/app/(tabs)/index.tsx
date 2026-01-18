import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  Pressable, 
  ScrollView, 
  Skeleton,
  Circle,
  Divider,
  Spacer
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';

export default function BankScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados do banco
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const QuickAction = ({ icon, label }: { icon: React.ComponentProps<typeof MaterialIcons>['name'], label: string }) => (
    <VStack space={2} alignItems="center" w="20%">
      <Pressable>
        <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
          <Icon as={<MaterialIcons name={icon} />} size={6} color={themeColors.tint} />
        </Circle>
      </Pressable>
      <Text fontSize="xs" fontWeight="medium" color={themeColors.text} textAlign="center">
        {label}
      </Text>
    </VStack>
  );

  const TransactionItem = ({ title, date, amount, icon, isNegative }: { title: string, date: string, amount: string, icon: React.ComponentProps<typeof MaterialIcons>['name'], isNegative: boolean }) => (
    <HStack space={4} alignItems="center" py={4}>
      <Circle size="10" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
        <Icon as={<MaterialIcons name={icon} />} size={5} color={themeColors.icon} />
      </Circle>
      <VStack flex={1}>
        <Text fontWeight="bold" color={themeColors.text}>{title}</Text>
        <Text fontSize="xs" color={themeColors.icon}>{date}</Text>
      </VStack>
      <Text fontWeight="bold" color={isNegative ? 'red.500' : 'green.500'}>
        {isNegative ? '-' : '+'} R$ {amount}
      </Text>
    </HStack>
  );

  if (isLoading) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
        <VStack space={6}>
          {/* Header Skeleton */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack space={2}>
              <Skeleton h="4" w="32" rounded="full" />
              <Skeleton h="6" w="48" rounded="full" />
            </VStack>
            <Skeleton size="10" rounded="full" />
          </HStack>

          {/* Balance Card Skeleton */}
          <Skeleton h="32" w="100%" rounded="2xl" />

          {/* Quick Actions Skeleton */}
          <HStack justifyContent="space-between">
            {[1, 2, 3, 4].map(i => (
              <VStack key={i} space={2} alignItems="center">
                <Skeleton size="12" rounded="full" />
                <Skeleton h="3" w="12" rounded="full" />
              </VStack>
            ))}
          </HStack>

          {/* Transactions Header Skeleton */}
          <HStack justifyContent="space-between" alignItems="center" mt={4}>
            <Skeleton h="6" w="32" rounded="full" />
            <Skeleton h="4" w="16" rounded="full" />
          </HStack>

          {/* Transactions List Skeleton */}
          <VStack space={4}>
            {[1, 2, 3, 4, 5].map(i => (
              <HStack key={i} space={4} alignItems="center">
                <Skeleton size="10" rounded="full" />
                <VStack flex={1} space={2}>
                  <Skeleton h="4" w="70%" rounded="full" />
                  <Skeleton h="3" w="40%" rounded="full" />
                </VStack>
                <Skeleton h="4" w="20%" rounded="full" />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
    );
  }

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text fontSize="sm" color={themeColors.icon}>Olá,</Text>
            <Heading size="md" color={themeColors.text}>{user?.name?.split(' ')[0] || 'Usuário'}</Heading>
          </VStack>
          <Pressable>
            <Circle size="10" bg={themeColors.tint} opacity={0.1}>
              <Icon as={<MaterialIcons name="notifications-none" />} size={6} color={themeColors.tint} />
            </Circle>
          </Pressable>
        </HStack>

        {/* Balance Card */}
        <Box 
          bg={themeColors.tint} 
          p={6} 
          rounded="2xl" 
          shadow={4}
        >
          <VStack space={2}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text color="white" opacity={0.8}>Saldo disponível</Text>
              <Icon as={<MaterialIcons name="visibility" />} size={5} color="white" />
            </HStack>
            <Heading color="white" size="xl">R$ 12.450,80</Heading>
            <HStack space={2} mt={2}>
              <Text color="white" fontSize="xs" opacity={0.8}>Investimentos:</Text>
              <Text color="white" fontSize="xs" fontWeight="bold">R$ 45.200,00</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <HStack justifyContent="space-between">
          <QuickAction icon="send" label="Pix" />
          <QuickAction icon="receipt-long" label="Boletos" />
          <QuickAction icon="trending-up" label="Investir" />
          <QuickAction icon="credit-card" label="Cartões" />
        </HStack>

        {/* Transactions */}
        <VStack space={2} mt={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="sm" color={themeColors.text}>Atividade Recente</Heading>
            <Pressable>
              <Text color={themeColors.tint} fontWeight="bold" fontSize="xs">Ver tudo</Text>
            </Pressable>
          </HStack>
          
          <VStack>
            <TransactionItem 
              title="Supermercado Silva" 
              date="Hoje, 10:45" 
              amount="154,20" 
              icon="shopping-cart" 
              isNegative 
            />
            <Divider opacity={0.5} />
            <TransactionItem 
              title="Transferência Recebida" 
              date="Ontem, 16:20" 
              amount="1.200,00" 
              icon="account-balance-wallet" 
              isNegative={false} 
            />
            <Divider opacity={0.5} />
            <TransactionItem 
              title="Assinatura Netflix" 
              date="15 Jan 2026" 
              amount="55,90" 
              icon="subscriptions" 
              isNegative 
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

