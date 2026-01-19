import React, { useState } from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  Button, 
  useToast, 
  ScrollView, 
  HStack, 
  Icon, 
  Circle,
  Pressable 
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';

export default function BoletosScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [barcode, setBarcode] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePayBoleto = async () => {
    if (!barcode || !amount) {
      toast.show({
        description: "Preencha todos os campos",
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
      await bankingService.payBoleto({
        barCode: barcode,
        amount: numericAmount,
        description: 'Pagamento de Boleto'
      });

      toast.show({
        description: "Boleto pago com sucesso!",
        bg: "success.500"
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao pagar boleto",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading color={themeColors.text}>Boletos</Heading>
        
        <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={6} rounded="2xl" shadow={2}>
          <VStack space={4}>
            <Heading size="sm" color={themeColors.text}>Pagar Novo Boleto</Heading>
            
            <FormInput 
              label="Código de Barras"
              placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000" 
              value={barcode}
              onChangeText={setBarcode}
              keyboardType="numeric"
            />

            <FormInput 
              label="Valor"
              placeholder="R$ 0,00" 
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Button 
              onPress={handlePayBoleto} 
              isLoading={isLoading}
              bg={themeColors.tint}
              _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
              mt={2}
              h={12}
              rounded="xl"
              leftIcon={<Icon as={<MaterialIcons name="qr-code-scanner" />} size="sm" />}
            >
              Pagar Boleto
            </Button>
          </VStack>
        </Box>

        <VStack space={4}>
          <Heading size="sm" color={themeColors.text}>Atalhos</Heading>
          <HStack space={4}>
            <Pressable flex={1} onPress={() => router.push('/banking/boletos-history')}>
              <VStack space={2} alignItems="center" bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={1}>
                <Circle size="10" bg="blue.100">
                  <Icon as={<MaterialIcons name="history" />} size={5} color="blue.500" />
                </Circle>
                <Text fontSize="xs" color={themeColors.text} textAlign="center">Histórico</Text>
              </VStack>
            </Pressable>
            
            <Pressable flex={1} onPress={() => router.push('/banking/boletos-dda')}>
              <VStack space={2} alignItems="center" bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" shadow={1}>
                <Circle size="10" bg="green.100">
                  <Icon as={<MaterialIcons name="file-download" />} size={5} color="green.500" />
                </Circle>
                <Text fontSize="xs" color={themeColors.text} textAlign="center">DDA</Text>
              </VStack>
            </Pressable>
          </HStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
