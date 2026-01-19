import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
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
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootState } from '@/store';
import { bankingService, Transaction } from '@/services/bankingService';
import { TransactionItem } from '@/components/banking/TransactionItem';

export default function BankScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useToast();
  const router = useRouter();

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [balanceData, transactionsData] = await Promise.all([
        bankingService.getBalance(),
        bankingService.getTransactions()
      ]);
      
      if (typeof balanceData === 'number') {
        setBalance(balanceData);
        setTotalInvested(0);
      } else {
        setBalance((balanceData as any).balance || 0);
        setTotalInvested((balanceData as any).totalInvested || 0);
      }
      setTransactions(transactionsData);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Silenciosamente tenta criar a conta se for 404
        try {
          await bankingService.createAccount();
          // Após criar, tenta buscar os dados novamente
          const [balanceData, transactionsData] = await Promise.all([
            bankingService.getBalance(),
            bankingService.getTransactions()
          ]);
          
          if (typeof balanceData === 'number') {
            setBalance(balanceData);
            setTotalInvested(0);
          } else {
            setBalance((balanceData as any).balance || 0);
            setTotalInvested((balanceData as any).totalInvested || 0);
          }
          setTransactions(transactionsData);
        } catch (createError) {
          console.error('Error in automatic account creation/fetch:', createError);
          toast.show({
            description: "Não foi possível inicializar sua conta bancária.",
            bg: "error.500"
          });
        }
      } else {
        console.error('Error fetching bank data:', error);
        toast.show({
          description: "Erro ao carregar dados bancários. Tente novamente mais tarde.",
          bg: "error.500"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    toast.show({
      description: `${label} copiado!`,
      bg: "success.500",
      duration: 2000
    });
  };

  const QuickAction = ({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialIcons>['name'], label: string, onPress?: () => void }) => (
    <VStack space={2} alignItems="center" mr={6} w={16}>
      <Pressable onPress={onPress}>
        <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
          <Icon as={<MaterialIcons name={icon} />} size={6} color={themeColors.tint} />
        </Circle>
      </Pressable>
      <Text fontSize="xs" fontWeight="medium" color={themeColors.text} textAlign="center" numberOfLines={1}>
        {label}
      </Text>
    </VStack>
  );

  if (isLoading && !isRefreshing) {
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
    <ScrollView 
      bg={themeColors.background} 
      _contentContainerStyle={{ p: 6 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={themeColors.tint} />
      }
    >
      <VStack space={6}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <VStack>
            <Text fontSize="sm" color={themeColors.icon}>Olá,</Text>
            <Heading size="md" color={themeColors.text}>{user?.name?.split(' ')[0] || 'Usuário'}</Heading>
          </VStack>
          <Pressable onPress={() => router.push('/notifications')}>
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
          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <VStack>
                <Text color="white" opacity={0.8} fontSize="xs">Saldo disponível</Text>
                <Heading color="white" size="xl">
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Heading>
              </VStack>
              <Pressable 
                onPress={() => copyToClipboard(user?.accountNumber || '12345-6', 'Número da conta')}
                bg="white" 
                p={2} 
                rounded="full" 
                opacity={0.2}
                _pressed={{ opacity: 0.4 }}
              >
                <Icon as={<MaterialIcons name="content-copy" />} size={5} color="white" />
              </Pressable>
            </HStack>
            
            <Divider bg="white" opacity={0.2} />
            
            <HStack justifyContent="space-between" alignItems="center">
              <HStack space={2} alignItems="center">
                <Icon as={<MaterialIcons name="trending-up" />} size={5} color="white" opacity={0.8} />
                <VStack>
                  <Text color="white" opacity={0.8} fontSize="10">Total Investido</Text>
                  <Text color="white" fontWeight="bold">
                    R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </VStack>
              </HStack>
              <Pressable onPress={() => router.push('/banking/invest')}>
                <HStack alignItems="center" space={1}>
                  <Text color="white" fontSize="xs" fontWeight="bold">Detalhes</Text>
                  <Icon as={<MaterialIcons name="chevron-right" />} size={4} color="white" />
                </HStack>
              </Pressable>
            </HStack>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} mt={2}>
          <HStack space={0}>
            <QuickAction icon="qr-code-scanner" label="Ler QR" onPress={() => router.push('/banking/pix-scan')} />
            <QuickAction icon="pix" label="Pix" onPress={() => router.push('/banking/pix')} />
            <QuickAction icon="receipt-long" label="Boletos" onPress={() => router.push('/banking/boletos')} />
            <QuickAction icon="add-circle-outline" label="Depositar" onPress={() => router.push('/banking/deposit')} />
            <QuickAction icon="swap-horiz" label="Transferir" onPress={() => router.push('/banking/transfer')} />
            <QuickAction icon="trending-up" label="Investir" onPress={() => router.push('/banking/invest')} />
            <QuickAction icon="credit-card" label="Cartões" onPress={() => router.push('/banking/cards')} />
          </HStack>
        </ScrollView>

        {/* Transactions */}
        <VStack space={2} mt={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="sm" color={themeColors.text}>Atividade Recente</Heading>
            <Pressable onPress={() => router.push('/banking/statement')}>
              <Text color={themeColors.tint} fontWeight="bold" fontSize="xs">Ver tudo</Text>
            </Pressable>
          </HStack>
          
          <VStack>
            {transactions.length > 0 ? (
              transactions.map((t, index) => (
                <React.Fragment key={t._id}>
                  <TransactionItem 
                    transaction={t} 
                    onPress={() => router.push({
                      pathname: '/banking/transaction-detail',
                      params: { id: t._id }
                    })}
                  />
                  {index < transactions.length - 1 && <Divider opacity={0.5} />}
                </React.Fragment>
              ))
            ) : (
              <Box py={8} alignItems="center">
                <Text color={themeColors.icon}>Nenhuma transação encontrada</Text>
              </Box>
            )}
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

