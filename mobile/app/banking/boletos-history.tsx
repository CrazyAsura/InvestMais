import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  ScrollView, 
  Skeleton,
  Divider,
  useToast,
  Center
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, Transaction } from '@/services/bankingService';
import { TransactionItem } from '@/components/banking/TransactionItem';

export default function BoletosHistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useToast();
  const router = useRouter();

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const allTransactions = await bankingService.getTransactions();
      const boletoTransactions = allTransactions.filter(t => t.type === 'boleto');
      setTransactions(boletoTransactions);
    } catch (error) {
      console.error('Error fetching boleto history:', error);
      toast.show({
        description: "Erro ao carregar histórico de boletos.",
        bg: "error.500"
      });
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

  if (isLoading && !isRefreshing) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
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
        <Heading size="lg" color={themeColors.text}>Histórico de Boletos</Heading>
        
        {transactions.length > 0 ? (
          <VStack space={2}>
            {transactions.map((t, index) => (
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
            ))}
          </VStack>
        ) : (
          <Center py={20}>
            <Icon as={<MaterialIcons name="receipt-long" />} size={16} color="coolGray.300" mb={4} />
            <Text color="coolGray.400" fontSize="lg">Nenhum boleto pago encontrado</Text>
          </Center>
        )}
      </VStack>
    </ScrollView>
  );
}
