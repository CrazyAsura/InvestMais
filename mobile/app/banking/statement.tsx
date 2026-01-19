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
  Select,
  CheckIcon,
  Input,
  Button
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, Transaction } from '@/services/bankingService';
import { TransactionItem } from '@/components/banking/TransactionItem';

export default function StatementScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const toast = useToast();
  const router = useRouter();

  const fetchTransactions = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await bankingService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.show({
        description: "Erro ao carregar o extrato.",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTransactions(true);
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'income' && !t.isNegative) || 
                         (filter === 'expense' && t.isNegative) || 
                         t.type === filter;
    
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Agrupar transações por data
  const groupedTransactions = filteredTransactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  if (isLoading && !isRefreshing) {
    return (
      <ScrollView bg={themeColors.background} p={6}>
        <VStack space={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
        <VStack space={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="lg" color={themeColors.text}>Extrato</Heading>
            <Select 
              selectedValue={filter} 
              minWidth="120" 
              accessibilityLabel="Filtrar por" 
              placeholder="Filtrar por" 
              _selectedItem={{
                bg: themeColors.tint,
                endIcon: <CheckIcon size="5" />
              }} 
              onValueChange={itemValue => setFilter(itemValue)}
            >
              <Select.Item label="Todos" value="all" />
              <Select.Item label="Entradas" value="income" />
              <Select.Item label="Saídas" value="expense" />
              <Select.Item label="Pix" value="pix" />
              <Select.Item label="Boletos" value="boleto" />
            </Select>
          </HStack>

          <Input 
            placeholder="Buscar por descrição..." 
            variant="filled" 
            width="100%" 
            borderRadius="xl" 
            py="3" 
            px="4" 
            value={search}
            onChangeText={setSearch}
            InputLeftElement={<Icon as={<MaterialIcons name="search" />} size={5} ml="4" color="coolGray.400" />}
            _focus={{ borderColor: themeColors.tint, bg: colorScheme === 'dark' ? 'coolGray.800' : 'white' }}
          />
        </VStack>

        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map((date) => (
            <VStack key={date} space={3}>
              <Text fontWeight="bold" color={themeColors.icon} fontSize="xs" textTransform="uppercase" ml={2}>
                {date}
              </Text>
              <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="2xl" shadow={2}>
                <VStack divider={<Divider />}>
                  {groupedTransactions[date].map((t: Transaction) => (
                    <TransactionItem 
                      key={t._id} 
                      transaction={t} 
                      onPress={() => router.push({
                        pathname: '/banking/transaction-detail',
                        params: { id: t._id }
                      })}
                    />
                  ))}
                </VStack>
              </Box>
            </VStack>
          ))
        ) : (
          <Box py={20} alignItems="center">
            <Icon as={<MaterialIcons name="search-off" />} size={16} color="coolGray.400" mb={4} />
            <Text color="coolGray.400" fontSize="lg">Nenhuma transação encontrada</Text>
            {search !== '' && (
              <Button variant="link" colorScheme="teal" onPress={() => setSearch('')}>
                Limpar busca
              </Button>
            )}
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}
