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
  HStack,
  Icon,
  Pressable
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService, QrCodeData } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function PixReceiveScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrCodeData, setQrCodeData] = useState<QrCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleGenerateQrCode = async () => {
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
      const data = await bankingService.generatePixQrCode(numericAmount, description);
      setQrCodeData(data);
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao gerar QR Code. Certifique-se de ter uma chave Pix cadastrada.",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (qrCodeData) {
      await Clipboard.setStringAsync(qrCodeData.qrCode);
      toast.show({
        description: "Código Pix copiado!",
        bg: "success.500"
      });
    }
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading size="lg" color={themeColors.text}>Receber Pix</Heading>
        
        {!qrCodeData ? (
          <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={6} rounded="2xl" shadow={2}>
            <VStack space={4}>
              <FormInput 
                label="Valor a receber"
                placeholder="R$ 0,00" 
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <FormInput 
                label="Descrição (opcional)"
                placeholder="Ex: Aluguel, Jantar..." 
                value={description}
                onChangeText={setDescription}
              />

              <Button 
                onPress={handleGenerateQrCode} 
                isLoading={isLoading}
                bg={themeColors.tint}
                mt={4}
                h={12}
                rounded="xl"
              >
                Gerar QR Code
              </Button>
            </VStack>
          </Box>
        ) : (
          <VStack space={6} alignItems="center">
            <Box bg="white" p={6} rounded="2xl" shadow={4}>
              <QRCode
                value={qrCodeData.qrCode}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </Box>

            <VStack space={2} alignItems="center" w="100%">
              <Text fontSize="sm" color="coolGray.500">Valor</Text>
              <Text fontSize="2xl" fontWeight="bold" color={themeColors.text}>
                R$ {qrCodeData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </Text>
              {qrCodeData.description && (
                <Text fontSize="md" color="coolGray.500">{qrCodeData.description}</Text>
              )}
            </VStack>

            <Box bg={colorScheme === 'dark' ? 'coolGray.800' : 'white'} p={4} rounded="xl" w="100%">
              <VStack space={2}>
                <Text fontSize="xs" color="coolGray.500" fontWeight="bold">Chave Pix</Text>
                <Text color={themeColors.text}>{qrCodeData.pixKey}</Text>
              </VStack>
            </Box>

            <HStack space={4} w="100%">
              <Button 
                flex={1}
                variant="outline"
                borderColor={themeColors.tint}
                _text={{ color: themeColors.tint }}
                onPress={() => setQrCodeData(null)}
                rounded="xl"
              >
                Novo Valor
              </Button>
              <Button 
                flex={1}
                bg={themeColors.tint}
                leftIcon={<Icon as={<MaterialIcons name="content-copy" />} size={4} />}
                onPress={copyToClipboard}
                rounded="xl"
              >
                Copia e Cola
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </ScrollView>
  );
}
