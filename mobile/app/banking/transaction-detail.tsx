import React, { useEffect, useState } from 'react';
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  HStack, 
  Divider, 
  Button, 
  useToast, 
  Center,
  Circle,
  Skeleton
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, Transaction } from '@/services/bankingService';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;
      try {
        const data = await bankingService.getTransactionById(id as string);
        setTransaction(data);
      } catch (error) {
        console.error('Error fetching transaction detail:', error);
        toast.show({
          description: "Erro ao carregar detalhes da transação.",
          bg: "error.500"
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return 'account-balance-wallet';
      case 'withdraw': return 'money-off';
      case 'transfer': return 'swap-horiz';
      case 'pix': return 'send';
      case 'boleto': return 'receipt-long';
      default: return 'payment';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <Center flex={1} bg={themeColors.background} p={6}>
        <VStack space={4} w="100%">
          <Skeleton h="20" rounded="2xl" />
          <Skeleton h="64" rounded="2xl" />
        </VStack>
      </Center>
    );
  }

  if (!transaction) return null;

  return (
    <VStack flex={1} bg={themeColors.background} p={6} space={6}>
      <Center py={8}>
        <Circle size="20" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'} mb={4}>
          <Icon as={<MaterialIcons name={getIcon(transaction.type)} />} size={10} color={themeColors.tint} />
        </Circle>
        <Heading color={themeColors.text} size="xl">
          {transaction.isNegative ? '-' : '+'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Heading>
        <Text color={themeColors.icon} mt={1}>{transaction.description}</Text>
      </Center>

      <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={6} rounded="2xl" shadow={2}>
        <VStack space={4}>
          <DetailRow label="Tipo de transação" value={transaction.type.toUpperCase()} themeColors={themeColors} />
          <Divider />
          <DetailRow label="Data e Hora" value={formatDate(transaction.date)} themeColors={themeColors} />
          <Divider />
          <DetailRow label="ID da Transação" value={transaction._id} themeColors={themeColors} />
          <Divider />
          <DetailRow 
            label="Status" 
            value="Concluída" 
            valueColor="green.500" 
            themeColors={themeColors} 
          />
        </VStack>
      </Box>

      <VStack space={3} mt="auto">
        <Button 
          variant="outline" 
          borderColor={themeColors.tint}
          _text={{ color: themeColors.tint }}
          onPress={() => {
            toast.show({
              description: "Comprovante compartilhado com sucesso!",
              bg: "success.500"
            });
          }}
          leftIcon={<Icon as={<MaterialIcons name="share" />} size="sm" />}
        >
          Compartilhar Comprovante
        </Button>
        <Button 
          bg={themeColors.tint}
          _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
          onPress={() => router.back()}
        >
          Voltar
        </Button>
      </VStack>
    </VStack>
  );
}

function DetailRow({ label, value, valueColor, themeColors }: any) {
  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Text color={themeColors.icon} fontSize="sm">{label}</Text>
      <Text color={valueColor || themeColors.text} fontWeight="bold" fontSize="sm" textAlign="right" flex={1} ml={4}>
        {value}
      </Text>
    </HStack>
  );
}
