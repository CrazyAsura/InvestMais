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

export default function DepositScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleDeposit = async () => {
    if (!amount) {
      toast.show({
        description: "Insira o valor do depósito",
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
      await bankingService.deposit(numericAmount, description || 'Depósito em conta');
      
      toast.show({
        description: "Depósito realizado com sucesso!",
        bg: "success.500"
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao realizar depósito",
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
          <Icon as={<MaterialIcons name="account-balance-wallet" />} size={12} color={themeColors.tint} />
        </Center>

        <Heading size="lg" color={themeColors.text} textAlign="center">Quanto deseja depositar?</Heading>
        <Text color={themeColors.icon} textAlign="center" px={8}>
          O valor será creditado instantaneamente na sua conta InvestMais.
        </Text>
        
        <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={6} rounded="2xl" shadow={2}>
          <VStack space={4}>
            <FormInput 
              label="Valor"
              placeholder="R$ 0,00" 
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <FormInput 
              label="Descrição (opcional)"
              placeholder="Ex: Depósito mensal" 
              value={description}
              onChangeText={setDescription}
            />

            <Button 
              onPress={handleDeposit} 
              isLoading={isLoading}
              bg={themeColors.tint}
              _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
              mt={4}
              h={12}
              rounded="xl"
            >
              Confirmar Depósito
            </Button>
          </VStack>
        </Box>

        <VStack space={4} mt={4}>
          <Heading size="sm" color={themeColors.text}>Dúvidas sobre depósito?</Heading>
          <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" borderLeftWidth={4} borderLeftColor={themeColors.tint}>
            <Text fontSize="sm" color={themeColors.text} fontWeight="bold">É seguro?</Text>
            <Text fontSize="xs" color={themeColors.icon}>Sim, todas as transações na InvestMais são criptografadas e protegidas.</Text>
          </Box>
          <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" borderLeftWidth={4} borderLeftColor={themeColors.tint}>
            <Text fontSize="sm" color={themeColors.text} fontWeight="bold">Qual o limite?</Text>
            <Text fontSize="xs" color={themeColors.icon}>O limite diário para depósitos é de R$ 50.000,00.</Text>
          </Box>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
