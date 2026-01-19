import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  HStack, 
  Box, 
  Text, 
  Heading, 
  Icon, 
  Pressable, 
  Button, 
  useToast,
  ScrollView,
  Circle,
  Actionsheet,
  useDisclose
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { bankingService } from '@/services/bankingService';
import { FormInput } from '@/components/ui/form-input';

export default function PixScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [copyPasteCode, setCopyPasteCode] = useState('');
  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (params.amount) setAmount(params.amount as string);
    if (params.pixKey) setPixKey(params.pixKey as string);
    if (params.scanned === 'true') {
      toast.show({
        description: "Dados do QR Code carregados",
        bg: "success.500"
      });
    }
  }, [params]);

  const handleDecodeCopyPaste = async () => {
    if (!copyPasteCode) return;
    setIsDecoding(true);
    try {
      const decoded = await bankingService.decodePixQrCode(copyPasteCode);
      setPixKey(decoded.pixKey);
      if (decoded.amount > 0) setAmount(decoded.amount.toString());
      toast.show({
        description: "Código Pix processado com sucesso",
        bg: "success.500"
      });
      onClose();
      setCopyPasteCode('');
    } catch (error) {
      toast.show({
        description: "Código Pix inválido",
        bg: "error.500"
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const handleSendPix = async () => {
    if (!amount || !pixKey) {
      toast.show({
        description: "Preencha todos os campos obrigatórios",
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
      await bankingService.sendPix({
        amount: numericAmount,
        pixKey,
        description
      });
      
      toast.show({
        description: "Pix enviado com sucesso!",
        bg: "success.500"
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      toast.show({
        description: error.response?.data?.message || "Erro ao enviar Pix",
        bg: "error.500"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView bg={themeColors.background} _contentContainerStyle={{ p: 6 }}>
      <VStack space={6}>
        <Heading size="lg" color={themeColors.text}>Enviar Pix</Heading>
        
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
              label="Chave Pix"
              placeholder="CPF, E-mail, Telefone ou Aleatória" 
              value={pixKey}
              onChangeText={setPixKey}
            />

            <FormInput 
              label="Descrição (opcional)"
              placeholder="O que é esse Pix?" 
              value={description}
              onChangeText={setDescription}
            />

            <Button 
              onPress={handleSendPix} 
              isLoading={isLoading}
              bg={themeColors.tint}
              _pressed={{ bg: themeColors.tint, opacity: 0.8 }}
              mt={4}
              h={12}
              rounded="xl"
            >
              Enviar Pix
            </Button>
          </VStack>
        </Box>

        <Heading size="md" color={themeColors.text} mt={4}>Ações Rápidas</Heading>
        <HStack justifyContent="space-between" flexWrap="wrap">
          <Pressable onPress={() => router.push('/banking/pix-scan')} w="30%" alignItems="center" mb={4}>
            <VStack space={2} alignItems="center">
              <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
                <Icon as={<MaterialIcons name="qr-code-scanner" />} size={6} color={themeColors.tint} />
              </Circle>
              <Text fontSize="xs" color={themeColors.text} textAlign="center">Ler QR Code</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={onOpen} w="30%" alignItems="center" mb={4}>
            <VStack space={2} alignItems="center">
              <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
                <Icon as={<MaterialIcons name="content-copy" />} size={6} color={themeColors.tint} />
              </Circle>
              <Text fontSize="xs" color={themeColors.text} textAlign="center">Pix Copia e Cola</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={() => router.push('/banking/pix-receive')} w="30%" alignItems="center" mb={4}>
            <VStack space={2} alignItems="center">
              <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
                <Icon as={<MaterialIcons name="get-app" />} size={6} color={themeColors.tint} />
              </Circle>
              <Text fontSize="xs" color={themeColors.text} textAlign="center">Receber Pix</Text>
            </VStack>
          </Pressable>

          <Pressable onPress={() => router.push('/banking/pix-keys')} w="30%" alignItems="center" mb={4}>
            <VStack space={2} alignItems="center">
              <Circle size="12" bg={colorScheme === 'dark' ? 'coolGray.800' : 'coolGray.100'}>
                <Icon as={<MaterialIcons name="vpn-key" />} size={6} color={themeColors.tint} />
              </Circle>
              <Text fontSize="xs" color={themeColors.text} textAlign="center">Minhas Chaves</Text>
            </VStack>
          </Pressable>
        </HStack>
      </VStack>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" p={6}>
            <VStack space={4}>
              <Heading size="md">Pix Copia e Cola</Heading>
              <Text color="coolGray.500">Cole o código Pix BRCode para realizar o pagamento.</Text>
              
              <FormInput 
                label="Código Pix"
                placeholder="00020126360014BR.GOV.BCB.PIX..."
                value={copyPasteCode}
                onChangeText={setCopyPasteCode}
                multiline
                numberOfLines={4}
              />

              <Button 
                onPress={handleDecodeCopyPaste}
                isLoading={isDecoding}
                bg={themeColors.tint}
                rounded="xl"
                h={12}
              >
                Processar Código
              </Button>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </ScrollView>
  );
}
