import React from 'react';
import { 
  HStack, 
  VStack, 
  Text, 
  Icon, 
  Circle,
  Pressable
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction } from '@/services/bankingService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface TransactionItemProps {
  transaction: Transaction;
  showFullDate?: boolean;
  onPress?: () => void;
}

export const TransactionItem = ({ transaction, showFullDate = false, onPress }: TransactionItemProps) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

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
    if (showFullDate) {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Pressable 
      onPress={onPress}
      _pressed={{
        bg: colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100',
        rounded: 'lg'
      }}
    >
      <HStack space={4} alignItems="center" py={4} px={2}>
        <Circle size="10" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
          <Icon as={<MaterialIcons name={getIcon(transaction.type)} />} size={5} color={themeColors.icon} />
        </Circle>
        <VStack flex={1}>
          <Text fontWeight="bold" color={themeColors.text} numberOfLines={1}>{transaction.description}</Text>
          <Text fontSize="xs" color={themeColors.icon}>{formatDate(transaction.date)}</Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text fontWeight="bold" color={transaction.isNegative ? 'red.500' : 'green.500'}>
            {transaction.isNegative ? '-' : '+'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
          <Text fontSize="10" color={themeColors.icon} textTransform="capitalize">
            {transaction.type}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};
