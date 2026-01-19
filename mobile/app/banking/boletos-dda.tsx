import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { 
  VStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  ScrollView, 
  HStack,
  Circle,
  Center,
  Divider,
  Button,
  useToast,
  Spinner
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService } from '@/services/bankingService';
import { useRouter } from 'expo-router';

export default function BoletosDDAScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const toast = useToast();
  const router = useRouter();

  const [ddaBoletos, setDdaBoletos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBoletos = async () => {
    try {
      const data = await bankingService.getDDABoletos();
      setDdaBoletos(data);
    } catch (error) {
      toast.show({
        description: "Erro ao carregar boletos do DDA",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBoletos();
  };

  const handlePayBoleto = async (boleto: any) => {
    try {
      await bankingService.payBoleto({
        barCode: boleto.barCode,
        amount: boleto.amount,
        description: `Pagamento DDA: ${boleto.beneficiary}`
      });
      toast.show({
        description: "Boleto pago com sucesso!",
        bg: "success.500"
      });
      fetchBoletos();
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao pagar boleto",
        bg: "error.500"
      });
    }
  };

  return (
    <ScrollView 
      bg={themeColors.background} 
      _contentContainerStyle={{ p: 6 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <VStack space={6}>
        <VStack>
          <Heading size="lg" color={themeColors.text}>DDA</Heading>
          <Text color={themeColors.icon}>Boletos registrados no seu CPF</Text>
        </VStack>

        <Box bg="blue.50" _dark={{ bg: 'blue.900' }} p={4} rounded="xl">
          <HStack space={3} alignItems="center">
            <Icon as={<MaterialIcons name="info-outline" />} size={6} color="blue.500" />
            <Text flex={1} fontSize="xs" color="blue.700" _dark={{ color: 'blue.200' }}>
              O DDA (Débito Direto Autorizado) permite que você visualize todos os boletos emitidos em seu nome sem precisar do papel.
            </Text>
          </HStack>
        </Box>

        <VStack space={4}>
          <Heading size="sm" color={themeColors.text}>Próximos Vencimentos</Heading>
          
          {isLoading ? (
            <Center py={10}>
              <Spinner color={themeColors.tint} />
            </Center>
          ) : ddaBoletos.length > 0 ? (
            ddaBoletos.map((boleto, index) => (
              <Box 
                key={boleto._id || index} 
                bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} 
                p={4} 
                rounded="xl" 
                shadow={1}
              >
                <VStack space={3}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack space={3} alignItems="center">
                      <Circle size="10" bg="coolGray.100" _dark={{ bg: 'coolGray.700' }}>
                        <Icon as={<MaterialIcons name="business" />} size={5} color={themeColors.tint} />
                      </Circle>
                      <VStack>
                        <Text fontWeight="bold" color={themeColors.text}>{boleto.beneficiary}</Text>
                        <Text fontSize="xs" color={themeColors.icon}>Vence em {new Date(boleto.dueDate).toLocaleDateString('pt-BR')}</Text>
                      </VStack>
                    </HStack>
                    <Text fontWeight="bold" color={themeColors.text}>
                      R$ {boleto.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                  </HStack>
                  <Divider opacity={0.5} />
                  <Button 
                    variant="ghost" 
                    colorScheme="teal" 
                    size="sm"
                    _text={{ fontWeight: 'bold' }}
                    onPress={() => handlePayBoleto(boleto)}
                  >
                    Pagar este boleto
                  </Button>
                </VStack>
              </Box>
            ))
          ) : (
            <Center py={10}>
              <Icon as={<MaterialIcons name="search-off" />} size={12} color="coolGray.300" mb={2} />
              <Text color="coolGray.400">Nenhum boleto encontrado no DDA</Text>
            </Center>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
}
