import React, { useEffect, useState } from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  HStack, 
  Icon, 
  Divider, 
  ScrollView, 
  Spinner, 
  Pressable, 
  Skeleton,
  useToast 
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, Investment } from '@/services/bankingService';

export default function InvestScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState({ balance: 0, totalInvested: 0 });
  const toast = useToast();

  const handleInvestPress = (symbol: string) => {
    toast.show({
      description: `Detalhes de ${symbol} em breve!`,
      bg: "info.500"
    });
  };

  const handleCategoryPress = (category: string) => {
    toast.show({
      description: `Filtrando por ${category}...`,
      bg: "info.500"
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invData, balData] = await Promise.all([
        bankingService.getTrendingInvestments(),
        bankingService.getBalance()
      ]);
      setInvestments(invData);
      setBalance(balData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading color={themeColors.text}>Investimentos</Heading>
        
        <Box bg={themeColors.tint} p={6} rounded="2xl" shadow={4}>
          <Text color="white" opacity={0.8}>Patrimônio Total</Text>
          <Heading color="white" size="xl">
            R$ {(balance.balance + balance.totalInvested).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Heading>
          <HStack space={2} mt={2}>
            <Text color="white" fontSize="xs">Investido:</Text>
            <Text color="white" fontSize="xs" fontWeight="bold">
              R$ {balance.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </HStack>
        </Box>

        <VStack space={4}>
          <Heading size="sm" color={themeColors.text}>Oportunidades em Alta</Heading>
          
          {isLoading ? (
            <VStack space={3}>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} h="20" rounded="xl" />
              ))}
            </VStack>
          ) : (
            investments.map((item, index) => (
              <Pressable key={item.symbol} onPress={() => handleInvestPress(item.symbol)}>
                <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={1}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack space={3} alignItems="center">
                      <Icon 
                        as={<MaterialIcons name={item.type === 'Ação' ? 'business' : 'trending-up'} />} 
                        size={6} 
                        color={item.type === 'Ação' ? 'blue.500' : 'green.500'} 
                      />
                      <VStack>
                        <Text fontWeight="bold" color={themeColors.text}>{item.symbol}</Text>
                        <Text fontSize="xs" color={themeColors.icon}>{item.name}</Text>
                      </VStack>
                    </HStack>
                    <VStack alignItems="flex-end">
                      <Text fontWeight="bold" color={themeColors.text}>
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Text>
                      <Text 
                        fontSize="xs" 
                        color={item.changePercent?.startsWith('-') ? 'red.500' : 'green.500'} 
                        fontWeight="bold"
                      >
                        {item.changePercent}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </Pressable>
            ))
          )}
        </VStack>

        <VStack space={4} mt={4}>
          <Heading size="sm" color={themeColors.text}>Categorias</Heading>
          <HStack space={4} flexWrap="wrap">
            {['Renda Fixa', 'Ações', 'FIIs', 'Cripto'].map(cat => (
              <Pressable key={cat} onPress={() => handleCategoryPress(cat)}>
                <Box 
                  bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} 
                  px={4} 
                  py={2} 
                  rounded="full" 
                  borderWidth={1} 
                  borderColor={themeColors.tint}
                  mb={2}
                >
                  <Text color={themeColors.tint} fontWeight="medium">{cat}</Text>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
