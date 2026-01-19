import React, { useState } from 'react';
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Button, 
  useToast,
  ScrollView,
  Center,
  Icon
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';

export default function TransferScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [amount, setAmount] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleTransfer = async () => {
    if (!amount || !toAccountNumber) {
      toast.show({
        description: "Preencha o valor e o número da conta",
        bg: "warning.500"
      });
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.show({
        description: "Insira um valor válido",
        bg: "warning.500"
      });
      return;
    }

    setIsLoading(true);
    try {
      await bankingService.transfer(toAccountNumber, numericAmount, description || 'Transferência entre contas');
      
      toast.show({
        description: "Transferência realizada com sucesso!",
        bg: "success.500"
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao realizar transferência",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Center py={6}>
          <Box bg={themeColors.tint} p={4} rounded="full" opacity={0.1} position="absolute" />
          <Icon as={<MaterialIcons name="swap-horiz" />} size={12} color={themeColors.tint} />
        </Center>

        <Heading size="lg" color={themeColors.text} textAlign="center">Transferir para conta</Heading>
        <Text color={themeColors.icon} textAlign="center" px={8}>
          Transfira instantaneamente para outras contas InvestMais.
        </Text>
        
        <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={6} rounded="2xl" shadow={2}>
          <VStack space={4}>
            <FormInput 
              label="Número da Conta"
              placeholder="Ex: 12345-6" 
              value={toAccountNumber}
              onChangeText={setToAccountNumber}
            />

            <FormInput 
              label="Valor"
              placeholder="R$ 0,00" 
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <FormInput 
              label="Descrição (opcional)"
              placeholder="Ex: Pagamento de almoço" 
              value={description}
              onChangeText={setDescription}
            />

            <Button 
              onPress={handleTransfer} 
              isLoading={isLoading}
              bg={themeColors.tint}
              _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
              mt={4}
              h={12}
              rounded="xl"
            >
              Confirmar Transferência
            </Button>
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}
